import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import EmployeeModel from "@/models/employee.model";
import OrderModel from "@/models/orders.model";
import { NextRequest } from "next/server";


export async function POST(req:NextRequest){
    dbConnect();
    const {orderId,otp} = await req.json();
    const order = await OrderModel.findById(orderId);
    if(!order){
        return sendError("incorrect order",404)
    };

    const isMatching = (order.otp === otp);
    if(!isMatching){
        return sendError("otp is not matching",403)
    };

    const updatedOrder = await OrderModel.findByIdAndUpdate(orderId,{
        orderStatus:"delivered",
        otp:null
    },{new:true});

    if(!updatedOrder){
        return sendError("unable to update order",403)
    };

    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(order.deliveryAgent,{
        isWorking:false,
        workingFor:null
    });

    if(!updatedEmployee){
        return sendError("unable to update employee",403)
    };

    return sendSuccess(updatedOrder,"order delivered")

};