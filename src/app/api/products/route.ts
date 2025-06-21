import { sendError, sendSuccess } from "@/helpers/sendResponse";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/products.model";
import { NextRequest } from "next/server";


interface CloudinaryUploadResult {
    public_id:string;
    [key:string]:any
};

// export async function POST(req:NextRequest){
//     dbConnect();
//     try {
//         const formData = await req.formData();
//         const images = formData.get("images") as File | null;

//         if(!images){
//             return sendError("file not found",404);
//         };
//         const bytes = await images.arrayBuffer();
//         const buffer = Buffer.from(bytes);

//         const result = await new Promise<CloudinaryUploadResult>(
//             (resolve,rejects)=>{
//                 const uploadStream = cloudinary.uploader.upload_stream(
//                     {folder:"project360"},
//                     (error,result)=>{
//                         if(error) rejects(error);
//                         else resolve(result as CloudinaryUploadResult);
//                     }
//                 )
//                 uploadStream.end(buffer);
//             }
//         );
//         return sendSuccess(result,"upload completed")
//     } catch (error) {
//         console.log("unable to add product",error);
//         return sendError("unable to add product",500,error)
//     }
// };


//?

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const images = formData.getAll('images') as File[];
    const name = formData.get("name");
    const description = formData.get("description");
    const discount = formData.get("discount");
    const price = formData.get("price");
    const tags = formData.get("tags");
    const stock = formData.get("stock");
    const category = formData.get("category");

    if (!images || images.length === 0) {
      return sendError('No files uploaded', 400);
    }

    // Upload all images in parallel
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

        return result.secure_url; 
      })
    );

    if(!uploadResults){
        return sendError("upload on cloudinary failed")
    };

    const createdProduct = new ProductModel({
        name,
        discount,
        description,
        price,
        category,
        tags,
        stock,
        images:uploadResults
    });

    await createdProduct.save();
    if(!createdProduct){
        return sendError("new product creation failed",401)
    };
    return sendSuccess(createdProduct,"product created successfully");
  } catch (error) {
    console.log('Upload failed:', error);
    return sendError('product upload failed', 500, error);
  }
}

//?

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