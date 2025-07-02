import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect    from "@/lib/dbConnect";
import CustomerModel from "@/models/customer.model";
import { NextRequest } from "next/server";


export async function POST(req:NextRequest,{params}:{params:{userId:string}}){
    dbConnect();
    try {
        const {code} = await req.json();
        const {userId} = await params;
        const user = await CustomerModel.findById(userId);
        if(!user){
            return sendError("user not found", 404);
        };
        if(user.isVerified){
            return sendError("user is already verified", 401);
        };
        const isCodeCorrect = user.verifyCode === code;
        const isCodeValid = new Date(user.verifyCodeExpiry) > new Date();
        if(isCodeCorrect && isCodeValid){
            user.isVerified = true;
            await user.save();
        return sendSuccess(user, "User verified successfully");    
        }else if(isCodeCorrect && !isCodeValid){
            return sendError("code expired please sign up again", 401);
        }else{
            return sendError("incorrect verification code", 402);
        };
    } catch (error) {
        console.log("unable to verify user", error)
        return sendError("unable to verify user", 500, error);
    }
} 