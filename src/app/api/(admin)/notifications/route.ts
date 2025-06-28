import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/models/admin.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import NotificationModel from "@/models/notification.model";



export async function GET(){
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

        const notifications = await NotificationModel.find({}).sort({createdAt:-1});

        return sendSuccess(notifications,"notifications found!!");

    } catch (error) {
        console.log("unable to load notifications",error);
        return sendError("unable to load notifications",500,error)
    }
}