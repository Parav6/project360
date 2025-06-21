import cloudinary from "@/lib/cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath:string) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            timestamp: Math.floor(Date.now() / 1000)
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        console.log("Error while uploading file on cloudinary ", error); 
        return null; 

    }         
    }


export {uploadOnCloudinary}