import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/models/admin.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import CustomerModel from "@/models/customer.model";



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
        // name and created by and isVerified
        const name = searchParams.get("name");
        const createdBy = searchParams.get("createdBy");   //2025-06-27
        const isVerifiedParam = searchParams.get("isVerified");
        const isVerified = isVerifiedParam === "true";

        const page = parseInt(searchParams.get("page")||"1");
        const limit = parseInt(searchParams.get("limit") || "20");

        let filter = {};

        if(name && createdBy){
            filter = {
                $and:[
                    {name:name},
                    {createdAt:{$lte:new Date(createdBy)}}
                ]
            };
        }else if(name && !createdBy){
            filter = {
                name:name
            }
        }else if(!name && createdBy){
            filter = {
                createdAt:{$lte:new Date(createdBy)}
            };
        }else{
            filter = {};
        };

        const customers = await CustomerModel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)  || {};

            
        if(isVerifiedParam&&isVerified===true){
            const verifiedCustomer = customers.filter((customer)=>customer.isVerified===true);
            return sendSuccess(verifiedCustomer,"get verifiedCustomer successfully.")
        }else if(isVerifiedParam&&isVerified===false){
            const unVerifiedCustomer = customers.filter((customer)=>customer.isVerified===false);
            return sendSuccess(unVerifiedCustomer,"get unVerifiedCustomer successfully.")
        }else{
            return sendSuccess(customers,"get customers successfully.")
        }
        
    } catch (error) {
        console.log("unable to load customers",error);
        return sendError("unable to load customers",500,error)
    }
}