import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import CartModel from "@/models/cart.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";


export async function PUT(req:NextRequest,{params}:{params:{itemId:string}}){
    dbConnect();
    try {
        const {quantity} = await req.json();
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
        const cart = await CartModel.findOne({user:customerId});
        if(!cart){
            return sendError("cart not found",404)
        };
        const productInCart = cart.items.find((item)=>item.product.equals(itemId));
        if(!productInCart){
            return sendError("product in cart not found",404)
        };
        productInCart.quantity = quantity;
        await cart.save();
        return sendSuccess(cart,"cart updated and product updated in cart");
    } catch (error) {
        console.log("unable to update item",error);
        return sendError("unable to update item",500,error);
    }
};

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
        const cart = await CartModel.findOne({user:customerId});
        if(!cart){
            return sendError("cart not found",404)
        };
        const productInCart = cart.items.find((item)=>item.product.equals(itemId));
        if(!productInCart){
            return sendError("product in cart not found",404)
        };
        // const id = productInCart._id;
        const updatedCart = await CartModel.findByIdAndUpdate(cart._id,{
            $pull:{items:{product:itemId}}
        },{new:true});
        if(!updatedCart){
            return sendError("unable to delete item from cart")
        };
        return sendSuccess(updatedCart,"item removed successfully");
    } catch (error) {
        console.log("unable to delete product from cart",error);
        return sendError("unable to delete product from cart",500,error);
    }
};