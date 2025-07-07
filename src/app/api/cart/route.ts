import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import CartModel from "@/models/cart.model";
import CustomerModel from "@/models/customer.model";
import ProductModel from "@/models/products.model";
import { RefreshToken } from "@/types/token";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";


export async function PUT(req:NextRequest){
    dbConnect();
    try {
        const cookieStore = cookies();
        const {productId,quantity} = await req.json();
        const accessToken = (await cookieStore).get("accessToken")?.value;
        if(!accessToken){
            return sendError("token not found",404)
        }
        const decodedToken:RefreshToken = jwt.verify(accessToken as string, process.env.ACCESS_TOKEN_SECRET as string);   
        const customerId = decodedToken._id;

        const customer = await CustomerModel.findById(customerId);
        if(!customer){
            return sendError("user not found",404)
        };

        const existingProduct = await ProductModel.findById(productId);
        if(!existingProduct){
            return sendError("product not available",404)
        };

        const existingCart = await CartModel.findOne({user:customerId});
        if(existingCart){
            //cart exist so push the product
            const cartId = existingCart._id;
            const productInCart = existingCart.items.find((item)=>item.product.equals(existingProduct._id));
            if(productInCart){
                //product exist in cart
                productInCart.quantity += quantity;
                await existingCart.save();
                return sendSuccess(existingCart,"cart updated and product updated in cart")
            }else{
                //product not exist in cart
                const updatedExistingCart = await CartModel.findByIdAndUpdate(cartId,{
                    $push:{items:{product:productId,quantity}}
                },{new:true});
                if(!updatedExistingCart){
                    return sendError("unable to update existing cart", 401)
                };
                return sendSuccess(updatedExistingCart,"cart updated and product added in cart")
            }
        }else{
            //cart not exist so create cart and push product
            const cart = await CartModel.create({
                user: customer._id,
                items: [{ product: productId, quantity }]
            });
            if(!cart){
                return sendError("unable to create new cart",402)
            };
            return sendSuccess(cart,"new cart created and items added")
        }

    } catch (error) {
        console.log("unable to put item in Cart",error);
        return sendError("unable to put item in Cart",500,error);
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
        const cart = await CartModel.findOne({user:customerId});
        if(!cart){
            return sendError("unable to find cart",404)
        };
        const productId = cart.items.map((item)=>item.product);
        const products = await ProductModel.find({_id:{$in:productId}}).select("name price images discount stock");

        const data = cart.items.map((item)=>{
            const product = products.find((p) => p._id.equals(item.product));
            return {
                ...item.toObject(),
                product,
            };
        })

        cart.items = data;

        return sendSuccess(cart,"get cart successful");
    } catch (error) {
        console.log("failed to get cart",error);
        return sendError("failed to get cart",500,error)
    }
};