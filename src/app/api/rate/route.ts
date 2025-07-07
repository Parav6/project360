import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import CustomerModel from "@/models/customer.model";
import { NextRequest } from "next/server";
import ProductModel from "@/models/products.model";

export async function POST(req:NextRequest){
    dbConnect();
    try {
        const {comment,rating,productId} = await req.json();
        if(!comment || !rating || !productId){
            return sendError("comment, rating and productId are required",400);
        }
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
            return sendError("customer not found",404)
        };

        const ratedProduct = await ProductModel.findByIdAndUpdate(productId,{
            $push:{rating:{user:customerId,rating,comment}}
        },{new:true});

        if(!ratedProduct){
            return sendError("error in product rating",401)
        };

        return sendSuccess(ratedProduct,"product rated successfully!!!");

    } catch (error) {
        console.log("unable to rate the product",error);
        return sendError("unable to rate the product",500,error);
    }
};