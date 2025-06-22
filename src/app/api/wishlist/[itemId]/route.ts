import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import CustomerModel from "@/models/customer.model";
import { NextRequest } from "next/server";


export async function DELETE(req:NextRequest,{params}:{params:{itemId:string}}){
    dbConnect();
    try {
        const {itemId} = await params;
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

        const productInWishlist = customer?.wishlist.find((item)=>item.equals(itemId));
        if(!productInWishlist){
            return sendError("product not in wishlist",404)
        };
        const updatedCustomer = await CustomerModel.findByIdAndUpdate(customerId,{
            $pull:{wishlist:itemId}
        },{new:true});
        if(!updatedCustomer){
            return sendError("error in deleting product from wishlist")
        };
        return sendSuccess(updatedCustomer,"item deleted from wishlist!!!!");
    } catch (error) {
        console.log("unable to delete item from wishlist",error);
        return sendError("unable to delete item from wishlist",500,error)
    }
}