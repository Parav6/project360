import dbConnect from "@/lib/dbConnect";
import CustomerModel from "@/models/customer.model";
import bcrypt  from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail.helper";
import EmployeeModel from "@/models/employee.model";
import { sendError, sendSuccess } from "@/helpers/sendResponse";
import { NextRequest } from "next/server";


export async function POST(req:NextRequest){
    dbConnect();
    try {
        const {name,email,password,role,phone} = await req.json();

        if(!name && !email && !password && !role && !phone){
            return sendError("All fields are compulsory", 404);
        };
        if(role==="customer"){
            //customer
            const existedUser = await CustomerModel.findOne({email});
            if(existedUser){
                if(existedUser.isVerified){
                    //user is verified
                    return sendError("user with this email already exists", 401);
                }else{
                    //user is not verified
                    const verifyCode = Math.floor(100000+ Math.random()*900000).toString();
                    const hashedPassword = await bcrypt.hash(password,10);
                    existedUser.name = name;
                    existedUser.password = hashedPassword;
                    existedUser.phone = phone;
                    existedUser.verifyCode = verifyCode;
                    existedUser.verifyCodeExpiry = new Date(Date.now()+3600000);
                    await existedUser.save();
                    const emailResponse = await sendVerificationEmail(email,name,verifyCode);
                    // if(!emailResponse.success){
                    //     throw new ApiError(400,"unable to send email");
                    // };
                    console.log(emailResponse);
                    return sendSuccess(existedUser, "customer created successfully"); 
                }
            }else{
                //new user
                const verifyCode = Math.floor(100000+ Math.random()*900000).toString();
                const hashedPassword = await bcrypt.hash(password,10);
                const newCustomer = new CustomerModel({
                    name,
                    email,
                    password:hashedPassword,
                    role:"customer",
                    phone,
                    verifyCode,
                    verifyCodeExpiry:new Date(Date.now()+3600000)
                });
                await newCustomer.save();
                const emailResponse = await sendVerificationEmail(email,name,verifyCode);
                // if(!emailResponse.success){
                //     throw new ApiError(400,"unable to send email");
                // };
                console.log(emailResponse)
                return sendSuccess(newCustomer, "new customer created successfully");
            }
        }else{
            //employee
            const existedEmployee = await EmployeeModel.findOne({email});
            if(existedEmployee){
                return sendError("employee with this email already exists", 401);
            };
            const hashedPassword = await bcrypt.hash(password,10);
            const newEmployee = new EmployeeModel({
                name,
                email,
                password:hashedPassword,
                role:"employee",
                phone,
            });
            await newEmployee.save();
            return sendSuccess(newEmployee, "employee created successfully");
        }
    } catch (error) {
        console.log("unable to sign up ", error);
        return sendError("unable to sign up", 500, error);
    }
};