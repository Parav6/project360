import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { sendError, sendSuccess } from "@/helpers/sendResponse";
import { RefreshToken } from "@/types/token";
import CustomerModel from "@/models/customer.model";
import EmployeeModel from "@/models/employee.model";
import AdminModel from "@/models/admin.model";


export async function POST(){
    dbConnect();
    try {
        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        if(!accessToken){
            return sendError("token not found",404)
        }
        const decodedToken: RefreshToken= jwt.verify(accessToken as string, process.env.ACCESS_TOKEN_SECRET as string);    //?
        if(decodedToken?.role==="customer"){
            await CustomerModel.findByIdAndUpdate(
                decodedToken?._id,
                {
                    $set:{
                        refreshToken:undefined
                    }
                },
                {
                    new:true
                }
            );
            (await cookieStore).delete("accessToken");
            (await cookieStore).delete("refreshToken");
            return sendSuccess({},"customer log out successful");
        }else if(decodedToken?.role==="employee"){
            await EmployeeModel.findByIdAndUpdate(
                decodedToken?._id,
                {
                    $set:{
                        refreshToken:undefined
                    }
                },
                {
                    new:true
                }
            );
            (await cookieStore).delete("accessToken");
            (await cookieStore).delete("refreshToken");
            return sendSuccess({},"employee log out successful")
        }else{
           await AdminModel.findByIdAndUpdate(
                decodedToken?._id,
                {
                    $set:{
                        refreshToken:undefined
                    }
                },
                {
                    new:true
                }
            );
            (await cookieStore).delete("accessToken");
            (await cookieStore).delete("refreshToken");
            return sendSuccess({},"admin log out successful") 
        }
    } catch (error) {
        console.log("unable to logout ",error);
        return sendError("unable to lor out",500,error)
    }
};