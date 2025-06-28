import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/models/admin.model";
import OrderModel from "@/models/orders.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import PaymentModel from "@/models/payment.model";


export async function GET({params}:{params:{id:string}}){
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
        const paymentLog = await PaymentModel.findById(id);
        if(!paymentLog){
            return sendError("payment log not found",404)
        };
        
        const correspondingOrder = await OrderModel.findById(paymentLog.orderId);
        if(!correspondingOrder){
            return sendError("order corresponding to payment log not found",404)
        };

        const data = {paymentLog,correspondingOrder};

        return sendSuccess(data,"payment details found");

    } catch (error) {
        console.log("unable to load employee",error);
        return sendError("unable to load employee",500,error)
    }
}