import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/products.model";

import { NextRequest } from "next/server";


export async function POST(req:NextRequest){
    dbConnect();
    try {
        //
    } catch (error) {
        console.log("unable to add product",error);
        return sendError("unable to add product",500,error)
    }
};

//  /api/products?search=laptop&page=2&limit=12
//search on the basis of [ prize, category, ]    $prize $category $smartSearch $page $limit
// smart search [name , tags]

export async function GET(req:NextRequest){             
    dbConnect();
    try {
        const {searchParams} = new URL(req.url);
        const category = searchParams.get("category") || "";
        const price = parseInt(searchParams.get("prize") || "0");
        // const $smartSearch = searchParams.get("smartSearch") || "";
        const page = parseInt(searchParams.get("page")||"1");
        const limit = parseInt(searchParams.get("limit") || "20");

      
        let filter = {};

        if(category && price){
            //both
            filter = {
                $or:[
                    { category: category },
                    { price: { $lte: price } },
                    {tags:category}
                ]
            };
        }else if(category && !price){
            //category
            filter = {
                $or:[
                    { category: category },
                    {tags:category}
                ]
            };
        }else if(!category && price){
            //prize
            filter = {
                price: { $lte: price }
            };
        }else{
            //none
            filter = {};
        }

        const products = await ProductModel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)  || {};

        const productCount = await ProductModel.countDocuments(filter) || 0;
        const data = {products,productCount};
        return sendSuccess(data, "products found");
        
    } catch (error) {
        console.log("unable to fetch products")
        return sendError("unable to fetch products",500,error)
    }
}