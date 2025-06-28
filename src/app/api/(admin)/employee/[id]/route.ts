import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/models/admin.model";
import OrderModel from "@/models/orders.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import EmployeeModel from "@/models/employee.model";
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
        const employee = await EmployeeModel.findById(id);
        if(!employee){
            return sendError("employee not found",404)
        };

        const allPreviousOrders = await OrderModel.find({deliveryAgent:id});

        const data = {
            employee,
            allPreviousOrders
        };

        return sendSuccess(data,"employee found!!");
        

    } catch (error) {
        console.log("unable to load employee",error);
        return sendError("unable to load employee",500,error)
    }
}