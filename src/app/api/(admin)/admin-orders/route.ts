import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/models/admin.model";
import OrderModel from "@/models/orders.model";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";


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
        const orderStatus = searchParams.get("orderStatus");
        const createdBy = searchParams.get("createdBy");
    
        const page = parseInt(searchParams.get("page")||"1");
        const limit = parseInt(searchParams.get("limit") || "20");
    
        let filter = {};
        if(orderStatus&&createdBy){
            filter = {
                $and:[
                    {orderStatus:orderStatus},
                    {createdAt:{$lte:new Date(createdBy)}}
                ]
            };
        }else if(!orderStatus && createdBy){
            filter = {
                createdAt:{$lte:new Date(createdBy)}
            };
        }else if(orderStatus&& !createdBy){
            filter = {orderStatus:orderStatus};
        }else{
            filter ={};
        };
    
        const orders = await OrderModel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)  || {};
    
        if(!orders){
            return sendError("unable to get orders",404)
        };
        
        return sendSuccess(orders,"orders found!!")
    } catch (error) {
        console.log("unable to load orders",error);
        return sendError("unable to load orders",500,error)
    }
}