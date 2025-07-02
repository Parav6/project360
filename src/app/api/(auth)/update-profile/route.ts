import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { sendError, sendSuccess } from "@/helpers/sendResponse";
import { RefreshToken } from "@/types/token";
import EmployeeModel from "@/models/employee.model";
import AdminModel from "@/models/admin.model";
import { NextRequest } from "next/server";
import CustomerModel from "@/models/customer.model";


export async function PUT(req:NextRequest){
    dbConnect();
    try {
        const cookieStore = cookies();
        const {name,phone,addresses} = await req.json();
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
                        name,
                        phone   
                    },
                    $push:{
                        addresses:addresses
                    }
                },
                {new:true}
            );
            const updatedCustomer = await CustomerModel.findById(decodedToken?._id);
            if(!updatedCustomer){
                return sendError("updated customer not found",404);
            };
            return sendSuccess(updatedCustomer,"customer updated successfully");
        }else if(decodedToken?.role==="employee"){
            await EmployeeModel.findByIdAndUpdate(
                decodedToken?._id,
                {
                    $set:{                            
                        name,
                        phone
                    },
                    $push:{
                        addresses:addresses
                    }
                },
                {new:true}
            );
            const updatedEmployee = await EmployeeModel.findById(decodedToken?._id);
            if(!updatedEmployee){
                return sendError("updated employee not found",404);
            };
            return sendSuccess(updatedEmployee,"employee updated successfully");
        }else{
            await AdminModel.findByIdAndUpdate(
                decodedToken?._id,
                {
                    $set:{                            
                        name,
                        phone
                    }
                },
                {new:true}
            );
            const updatedAdmin = await AdminModel.findById(decodedToken?._id);
            if(!updatedAdmin){
                return sendError("updated admin not found",404);
            };
            return sendSuccess(updatedAdmin,"admin updated successfully");
        }
    } catch (error) {
        console.log("unable to update user ",error);
        return sendError("unable to update user",500,error)
    }
};