import { sendError, sendSuccess } from "@/helpers/sendResponse";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/products.model";
import { NextRequest } from "next/server";
import { CloudinaryUploadResult } from "../route";


export async function GET(req:NextRequest,{params}:{params: {id: string}}){
    dbConnect();
    try {
        const {id}= await params;
        const product = await ProductModel.findById(id);
        if(!product){
            return sendError("product not found",404)
        };
        return sendSuccess(product,"product found!!!");
    } catch (error) {
        console.log("unable to get details of this product",error);
        return sendError("unable to get details of this product",500,error);
    }
};

export async function DELETE(req:NextRequest,{params}:{params:{id:string}}){
    dbConnect();
    try {
        const {id} = await params;
        const deletedProduct = await ProductModel.findByIdAndUpdate(id,{isDeleted:true});
        console.log(deletedProduct)
        if(!deletedProduct){
            return sendError("unable to delete product",401)
        };
        return sendSuccess({},"product deleted");
    } catch (error) {
        console.log("unable to delete product",error);
        return sendError("unable to delete product",500,error);
    }
};

export async function PUT(req:NextRequest,{params}:{params:{id:string}}){
    dbConnect();
    try {
        const {id} = await params;
        const product = await ProductModel.findById(id);
        if(!product){
            return sendError("product not found",404)
        };
        const deleteImages = product?.images.map(async(image)=>{
            const result = await cloudinary.uploader.destroy(image.publicId);
            return result.result
        });
        if(deleteImages.length===0){
            return sendError("image deletion failed",403)
        };
        const formData = await req.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const discount = formData.get("discount");
        const price = formData.get("price");
        const tags = formData.get("tags");
        const stock = formData.get("stock");
        const category = formData.get("category");
        const images = formData.getAll('images') as File[];

        if (!images || images.length === 0) {
        return sendError('No files uploaded', 400);
        };

        const uploadResults = await Promise.all(
              images.map(async (file) => {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
        
                const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
                  const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'project360' },
                    (error, result) => {
                      if (error) reject(error);
                      else resolve(result as CloudinaryUploadResult);
                    }
                  );
                  uploadStream.end(buffer);
                });
                const data = {
                  publicId: result.public_id,
                  url: result.secure_url
                }
                return data; 
              })
            );

        if(!uploadResults){
        return sendError("upload on cloudinary failed")
        };    

        const newProduct = await ProductModel.findByIdAndUpdate(id,{
            name,
            description,
            discount,
            price,
            tags,
            stock,
            category,
            images:uploadResults
        },{new:true});

        if(!newProduct){
            return sendError("product update failed",401)
        };

        return sendSuccess(newProduct,"product updated!!!")

    } catch (error) {
        console.log("unable to update product",error);
        return sendError("unable to update product",500,error);
    }

};