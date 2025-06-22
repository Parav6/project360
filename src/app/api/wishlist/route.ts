import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import CustomerModel from "@/models/customer.model";


export async function POST(req:NextRequest){
    dbConnect();
    try {
        const {product} = await req.json();
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

        const productInWishlist = customer?.wishlist.find((item)=>item.equals(product));
        if(productInWishlist){
            return sendError("product already in wishlist",401)
        };

        const updatedCustomer = await CustomerModel.findByIdAndUpdate(customerId,{
            $push:{wishlist:product}
        },{new:true});
        if(!updatedCustomer){
            return sendError("error in pushing the product")
        };
        return sendSuccess(updatedCustomer,"product added to wishlist successfully");
    } catch (error) {
        console.log("unable to add product in wishlist",error);
        return sendError("unable to add product in wishlist",500,error)
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
        return sendSuccess(customer,"wishlist found!!!");
    } catch (error) {
        console.log("unable to get wishlist",error);
        return sendError("unable to get wishlist",500,error)
    }
};