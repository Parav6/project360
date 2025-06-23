import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import CustomerModel from "@/models/customer.model";
import OrderModel from "@/models/orders.model";

export async function GET(req:NextRequest,{params}:{params: {orderId: string}}){
    dbConnect();
    try {
        const {orderId}= await params;
       const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        if(!accessToken){
            return sendError("token not found",404)
        }
        const decodedToken:RefreshToken = jwt.verify(accessToken as string, process.env.ACCESS_TOKEN_SECRET as string);   
        if(!decodedToken){
            return sendError("invalid token",401)
        };
        const customerId = decodedToken._id;

        const customer = await CustomerModel.findById(customerId);
        if(!customer){
            return sendError("unable to get customer",404)
        };
        const orderItem = await OrderModel.findById(orderId);
        if(orderItem){
            sendError("order not found",404)
        };
        if(orderItem?.user != customerId){
            return sendError("order does not belong to user",403)
        };
        return sendSuccess(orderItem,"order found!!!");
    } catch (error) {
        console.log("unable to get this order",error);
        return sendError("unable to get this order",500,error);
    }
};