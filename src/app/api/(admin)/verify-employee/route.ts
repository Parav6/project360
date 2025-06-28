import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import EmployeeModel from "@/models/employee.model";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import AdminModel from "@/models/admin.model";


export async function PUT(req:NextRequest){
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

        const {employeeId} = await req.json();

        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(employeeId,{
            isVerified:true
        },{new:true});

        if(!updatedEmployee){
            return sendError("error in employee verification",401)
        };

        return sendSuccess(updatedEmployee,"employee verified successfully");
    } catch (error) {
        console.log("unable to verify employee",error);
        return sendError("unable to verify employee",500,error)
    }
}