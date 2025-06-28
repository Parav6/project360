import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/models/admin.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import PaymentModel from "@/models/payment.model";



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
        //status date
        const status = searchParams.get("status");
        const createdBy = searchParams.get("createdBy");

        const page = parseInt(searchParams.get("page")||"1");
        const limit = parseInt(searchParams.get("limit") || "20");

        let filter = {};
        if(createdBy){
            filter = {
                createdAt:{$lte:new Date(createdBy)}
            };
        };

        const paymentLogs = await PaymentModel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)  || {};

        if(status){
            const filteredPaymentLogs = paymentLogs.filter((log)=>log.status===status);
            return sendSuccess(filteredPaymentLogs,"filtered payment logs found")
        }else{
            return sendSuccess(paymentLogs,"payment logs found")
        }

    } catch (error) {
        console.log("unable to load payment logs",error);
        return sendError("unable to load payment logs",500,error)
    }
}