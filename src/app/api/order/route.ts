import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import CustomerModel from "@/models/customer.model";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import OrderModel from "@/models/orders.model";
// import { orderQueue } from "@/lib/queues/orderQueue";


export async function POST(req:NextRequest){
    dbConnect();
    try {
        const {items,address,totalAmount} = await req.json();
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
        const order = new OrderModel({
            user:customerId,
            products:items,
            address:address,
            paymentStatus:"pending",
            orderStatus:"placed",
            totalAmount:totalAmount,
        });
        await order.save();
        if(!order){
            return sendError("error in order creation",401)
        };

        //* add work to queue 
        // const res = await orderQueue.add("assignWorker",{orderId : order._id});
        // console.log("order added to queue",res.id);

        return sendSuccess(order,"order created successfully");
    } catch (error) {
        console.log('unable to create order', error);
        return sendError('unable to create order', 500, error);
    }
};

export async function GET(){
    dbConnect();
    try {
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
        const orders = await OrderModel.find({user:customerId});
        if(!orders){
            return sendError("no orders found",404)
        };

        
        return sendSuccess(orders,"orders found!!!")
    } catch (error) {
        console.log('unable to find order', error);
        return sendError('unable to find order', 500, error);
    }
};