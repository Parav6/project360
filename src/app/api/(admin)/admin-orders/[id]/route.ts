import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/models/admin.model";
import OrderModel from "@/models/orders.model";
import PaymentModel from "@/models/payment.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import CustomerModel from "@/models/customer.model";
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
        
        const order = await OrderModel.findById(id);
        if(!order){
            return sendError("order not found",404)
        };

        const customer = await CustomerModel.findById(order.user);
        if(!customer){
            return sendError("customer not found",404)
        }

        const paymentLog = await PaymentModel.findOne({orderId:id});
        if(!paymentLog){
            return sendError("payment log not found",404)
        };

        const data ={
            order,
            customer,
            paymentLog
        }

        return sendSuccess(data, "order found!!!!");

    } catch (error) {
        console.log("unable to load a specific order",error);
        return sendError("unable to load a specific order",500,error)
    }
}