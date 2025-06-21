import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { sendError, sendSuccess } from "@/helpers/sendResponse";
import { RefreshToken } from "@/types/token";
import CustomerModel from "@/models/customer.model";
import EmployeeModel from "@/models/employee.model";
import AdminModel from "@/models/admin.model";


export async function GET(){
    dbConnect();
    try {
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        if(!accessToken){
            return sendError("token not found",404)
        }
        const decodedToken: RefreshToken= jwt.verify(accessToken as string, process.env.ACCESS_TOKEN_SECRET as string);    //?
        if(decodedToken?.role==="customer"){
            const customer = await CustomerModel.findById(decodedToken?._id);
            if(!customer){
                return sendError("customer not found",404);
            };
            return sendSuccess(customer,"customer found");
        }else if(decodedToken?.role==="employee"){
            const employee = await EmployeeModel.findById(decodedToken?._id);
            if(!employee){
                return sendError("employee not found",404);
            };
            return sendSuccess(employee,"employee found");
        }else{
           const admin = await AdminModel.findById(decodedToken?._id);
            if(!admin){
                return sendError("admin not found",404);
            };
            return sendSuccess(admin,"admin found"); 
        }
    } catch (error) {
        console.log("unable to load user ",error);
        return sendError("unable to load user",500,error)
    }
};