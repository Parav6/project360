// import { sendError, sendSuccess } from "@/helpers/sendResponse";
// import dbConnect from "@/lib/dbConnect";
// import { NextRequest } from "next/server";
// import crypto from "crypto"
// import PaymentModel from "@/models/payment.model";
// import OrderModel from "@/models/orders.model";
// import CartModel from "@/models/cart.model";
// import { cookies } from "next/headers";
// import CustomerModel from "@/models/customer.model";
// import jwt from "jsonwebtoken"
// import { orderQueue } from "@/lib/queues/orderQueue";


// export async function POST(req:NextRequest){
//     dbConnect();
//     try {
//         const{razorpay_order_id,razorpay_payment_id,razorpay_signature,paymentLog_orderId,orderId} = await req.json();
//         const secret = process.env.RAZORPAY_API_SECRET || "";
//         const body = razorpay_order_id + "|" + razorpay_payment_id;

//         const cookieStore = cookies();
//         const accessToken = (await cookieStore).get("accessToken")?.value;
//         if(!accessToken){
//             return sendError("token not found",404)
//         }
//         const decodedToken:RefreshToken = jwt.verify(accessToken as string, process.env.ACCESS_TOKEN_SECRET as string);   
//         if(!decodedToken){
//             return sendError("invalid token",401)
//         };
//         const customerId = decodedToken._id;

//         const customer = await CustomerModel.findById(customerId);
//         if(!customer){
//             return sendError("unable to get customer",404)
//         };

//         const expectedSignature = crypto
//             .createHmac("sha256", secret)
//             .update(body.toString())
//             .digest("hex");

//         const isAuthentic = expectedSignature === razorpay_signature;

//         const paymentId = paymentLog_orderId;
        
//         if(!isAuthentic){
//             const updatedPaymentLog = await PaymentModel.findByIdAndUpdate(paymentId,{
//             razorpayOrderId:razorpay_order_id,
//             razorpayPaymentId:razorpay_payment_id,
//             razorpaySignature:razorpay_signature,
//             status:"success",
//             },{new:true});
//             if(!updatedPaymentLog){
//                 return sendError("unable to update payment log and payment is not authentic",405)
//             };
//             const updatedOrder = await OrderModel.findByIdAndUpdate(orderId,{
//             paymentStatus:"failed",
//             orderStatus:"placed",
//             },{new:true});
//             if(!updatedOrder){
//                 return sendError("unable to update order and payment is not authentic",405)
//             };
//             return sendError("payment is not authentic",405);
//         };

//         const updatedPaymentLog = await PaymentModel.findByIdAndUpdate(paymentId,{
//             razorpayOrderId:razorpay_order_id,
//             razorpayPaymentId:razorpay_payment_id,
//             razorpaySignature:razorpay_signature,
//             status:"success",
//         },{new:true});

//         if(!updatedPaymentLog){
//             return sendError("unable to update payment log but payment is authentic",403)
//         };

//         const updatedOrder = await OrderModel.findByIdAndUpdate(orderId,{
//             paymentStatus:"paid",
//             orderStatus:"processing",
//         },{new:true});

//         if(!updatedOrder){
//             return sendError("unable to update order but payment is  authentic",403)
//         };

//         const deletedCart = await CartModel.deleteOne({user:customerId});
//         if(!deletedCart){
//             return sendError("unable to delete cart",403)
//         };

//         //* add work to queue 
//         const res = await orderQueue.add("assignWorker",{orderId});
//         console.log("order added to queue",res.id);

//         // redirect to desired page.
//         return sendSuccess(updatedOrder,"order is processing")
        
//     } catch (error) {
//         console.log("unable to verify payment",error);
//         return sendError("unable to verify payment",500,error);
//     }
// };