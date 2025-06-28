import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/models/admin.model";
import CustomerModel from "@/models/customer.model";
import OrderModel from "@/models/orders.model";
import PaymentModel from "@/models/payment.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";


export async function GET(req:NextRequest,{params}:{params:{id:string}}){
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
        const {id} = await params;
        const customer = await CustomerModel.findById(id);

        if(!customer){
            return sendError("customer not found",404)
        };

        const orders = await OrderModel.find({user:id});
        
        const orderIds : string[] = [];
        if(orders.length!=0){
            orders.forEach(order => {
                orderIds.push(order._id as string);
            });
        };

        const paymentLogs = await PaymentModel.find({orderId:{$in:orderIds}}).select("-razorpayPaymentId -razorpaySignature");

        const data = {
            customer,
            orders,
            paymentLogs
        };

        return sendSuccess(data,"detailed data of customer found!!!");

    } catch (error) {
        console.log("unable to load customer",error);
        return sendError("unable to load customer",500,error)
    }
}