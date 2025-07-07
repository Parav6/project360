import { sendError, sendSuccess } from "@/helpers/sendResponse";
import { instance } from "@/lib/razorpay";
import PaymentModel from "@/models/payment.model";
import { NextRequest } from "next/server";


export async function POST(req:NextRequest){
    try {
        const {orderId,totalAmount} = await req.json();

        if(!totalAmount){
            return sendError("total amount not found",404)
        };

        const options= {
           amount: (totalAmount*100),
           currency: "INR",
           receipt: `receipt_order_${Date.now()}`,
       };

       const paymentLog = await new PaymentModel({
        orderId,
        status:"pending",
        amount:totalAmount
       }).save(); 

       if(!paymentLog){
        return sendError("unable to store payment log in database")
       };
       
       const order = await instance.orders.create(options);
       console.log(JSON.stringify(order,null,2));

       if(!order){
        return sendError("error in order creation",401)
       };

       const data = {
        order:order,
        logId:paymentLog._id,
        orderId:orderId,
       }
       console.log(data)
       return sendSuccess(data,"order created in Razorpay")
    } catch (error) {
        console.log("unable to create order in razorpay",error);
        return sendError("unable to create order in razorpay",500,error);
    }
};