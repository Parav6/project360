import { sendError, sendSuccess } from "@/helpers/sendResponse";
import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/models/admin.model";
import CustomerModel from "@/models/customer.model";
import EmployeeModel from "@/models/employee.model";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


export async function POST(req:NextRequest){
    dbConnect();
    const cookieStore = cookies();
    try {
        const {email,password,role} = await req.json();
        if(role==="customer"){
            //customer
            const customer = await CustomerModel.findOne({email});
            if(!customer){
               return sendError("user not found", 404); 
            };
            const isPasswordCorrect = await bcrypt.compare(password,customer.password);
            if(!isPasswordCorrect){
              return sendError("password incorrect", 401);   
            };
            //*generate token
            const accessToken = await jwt.sign(
                {
                    _id : customer._id,
                    email,
                    name:customer.name,
                    phone:customer.phone,
                    role:"customer"
                },
                "parav6",
                {
                    expiresIn: "1d"
                }
            );
            const refreshToken = jwt.sign(
                {
                    _id : customer._id,
                },
                "parav6",
                {
                    expiresIn:"1d"
                }
            );
            if(!accessToken&&!refreshToken){
                return sendError("unable to generate token",403);
            };
            customer.refreshToken = refreshToken;
            customer.save();
            const options = {
                httpOnly : true,                            
                secure : true 
            };
            (await cookieStore).set("accessToken",accessToken,options);
            (await cookieStore).set("refreshToken",refreshToken,options);    
            const createdUser = await CustomerModel.findById(customer._id);
            return sendSuccess(createdUser, "customer log in successful");
        }else if(role==="employee"){
            //employee
            const employee = await EmployeeModel.findOne({email});
            if(!employee){
               return sendError("user not found", 404); 
            };
            const isPasswordCorrect = await bcrypt.compare(password,employee.password);
            if(!isPasswordCorrect){
              return sendError("password incorrect", 401);   
            };
            //*generate token
            const accessToken = await jwt.sign(
                {
                    _id : employee._id,
                    email,
                    name:employee.name,
                    phone:employee.phone,
                    role:"employee"
                },
                "parav6",
                {
                    expiresIn: "1d"
                }
            );
            const refreshToken = jwt.sign(
                {
                    _id : employee._id,
                },
                "parav6",
                {
                    expiresIn:"1d"
                }
            );
            if(!accessToken&&!refreshToken){
                return sendError("unable to generate token",403);
            };
            employee.refreshToken = refreshToken;
            employee.save();
            const options = {
                httpOnly : true,                            
                secure : true 
            };
            (await cookieStore).set("accessToken",accessToken,options);
            (await cookieStore).set("refreshToken",refreshToken,options);    
            const createdUser = await EmployeeModel.findById(employee._id);
            return sendSuccess(createdUser, "employee log in successful");
        }else{
            //admin
            const admin = await AdminModel.findOne({email});
            if(!admin){
               return sendError("user not found", 404); 
            };
            const isPasswordCorrect = await bcrypt.compare(password,admin.password);
            if(!isPasswordCorrect){
              return sendError("password incorrect", 401);   
            };
            //*generate token
            const accessToken = await jwt.sign(
                {
                    _id : admin._id,
                    email,
                    name:admin.name,
                    phone:admin.phone,
                    role:"admin"
                },
                "parav6",
                {
                    expiresIn: "1d"
                }
            );
            const refreshToken = jwt.sign(
                {
                    _id : admin._id,
                },
                "parav6",
                {
                    expiresIn:"1d"
                }
            );
            if(!accessToken&&!refreshToken){
                return sendError("unable to generate token",403);
            };
            admin.refreshToken = refreshToken;
            admin.save();
            const options = {
                httpOnly : true,                            
                secure : true 
            };
            (await cookieStore).set("accessToken",accessToken,options);
            (await cookieStore).set("refreshToken",refreshToken,options);    
            const createdUser = await AdminModel.findById(admin._id);
            return sendSuccess(createdUser, "admin log in successfully")
        }
    } catch (error) {
        console.log("unable to log in user", error)
        return sendError("unable to login", 500, error);
    }
}