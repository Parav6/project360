import { sendDeliveryOtpEmail } from "@/helpers/sendDeliveryOtpEmail";
import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import CustomerModel from "@/models/customer.model";
import OrderModel from "@/models/orders.model";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken"

export async function POST(req:NextRequest){
    dbConnect();
    try {
        const {orderId} = await req.json();
        const order = await OrderModel.findById(orderId);
        if(!order){
            return sendError("incorrect order",404)
        };

        const cookieStore = cookies();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        if(!accessToken){
            return sendError("token not found",404)
        }
        const decodedToken:RefreshToken = jwt.verify(accessToken as string, process.env.ACCESS_TOKEN_SECRET as string);   
        const employeeId = decodedToken._id;

       
        if(employeeId!=order.deliveryAgent.toString()){
            return sendError("wrong delivery agent",401)
        };

        const otp = Math.floor(100000+ Math.random()*900000).toString();
        const customerId = order?.user;
        const customer = await CustomerModel.findById(customerId);
        if(!customer){
            return sendError("invalid customer",404)
        };
        const email = customer.email;
        const name = customer.name;
        const updatedOrder = await OrderModel.findByIdAndUpdate(orderId,{
            otp
        },{new:true});
        if(!updatedOrder){
            return sendError("unable to save otp in order",401)
        };
        //send email
        const emailResponse = await sendDeliveryOtpEmail(email,name,otp);
        // if(!emailResponse.success){
        //     return sendError("unable to send otp email",401)
        // };
        return sendSuccess(updatedOrder,"otp send successfully");
    } catch (error) {
        console.log("unable to send otp to customer",error);
        return sendError("unable to send otp to customer",500,error)
    }
};