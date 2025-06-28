import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/models/admin.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import EmployeeModel from "@/models/employee.model";



export async function GET(req:NextRequest){
    dbConnect();
    try {
        //* admin checking
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        if(!accessToken){
            return sendError("token not found",404)
        }
        const decodedToken:RefreshToken = jwt.verify(accessToken as string, process.env.ACCESS_TOKEN_SECRET as string);   
        const adminId = decodedToken._id;
        
        const isAdminExist = await AdminModel.findById(adminId);
        if(!isAdminExist){
            return sendError("Unauthorized request, only admin is allowed")
        };
        //*

        const {searchParams} = new URL(req.url);
        //isWorking isVerified name
        const name = searchParams.get("name");
        const isWorkingParams = searchParams.get("isWorking");
        const isWorking = isWorkingParams==="true";
        const isVerifiedParams = searchParams.get("isVerified");
        const isVerified = isVerifiedParams==="true" ;   // default true

        const page = parseInt(searchParams.get("page")||"1");
        const limit = parseInt(searchParams.get("limit") || "20");

        let filter = {};
        if(name){
            filter = {
                $and:[
                    {name:name},
                    {isVerified:isVerified}
                ]
            };
        }else{
            filter = {isVerified:isVerified};
        }

        const employees = await EmployeeModel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)  || {};

        if(isWorkingParams&&isWorking===true){
            const workingEmployee = employees.filter((emp)=>emp.isWorking===true)
            return sendSuccess(workingEmployee,"get workingEmployee successfully.")
        }else if(isWorkingParams&&isWorking===false){
            const nonWorkingEmployee = employees.filter((emp)=>emp.isWorking===false)
            return sendSuccess(nonWorkingEmployee,"get nonWorkingEmployee successfully.")
        }else{
            return sendSuccess(employees,"get employees successfully.")
        }

    } catch (error) {
        console.log("unable to load customers",error);
        return sendError("unable to load customers",500,error)
    }
}