import mongoose, {Schema,Document,Types} from "mongoose";
import { Address, addressSchema } from "./customer.model";

export interface Product extends Document{
    product:Types.ObjectId;
    quantity:number;
    price:number
};

export const productSchema: Schema<Product> = new Schema({
    product:{
        type:Schema.Types.ObjectId,
        ref:"products",
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:0
    },
    price:{
        type:Number,
        required:true,
        min:0
    }
})

export interface Order extends Document{
    user:Types.ObjectId;
    products:Product[];
    address:Address;
    paymentStatus:"pending" | "paid" | "failed";
    orderStatus:'placed'| 'processing'|  'shipped'| 'delivered'| 'cancelled';
    deliveryAgent:Types.ObjectId;
    totalAmount:number;
    otp:string;
    createdAt?: Date;
    updatedAt?: Date;
};

export const orderSchema: Schema<Order> = new Schema({
    user: {
        type:Schema.Types.ObjectId,
        ref: 'customers' 
    },
    products:[productSchema],
    address:addressSchema,
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['placed', 'processing','shipped', 'delivered', 'cancelled'],
        default: 'placed' 
    },
    deliveryAgent: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'employees' 
    },
    otp: String,
    totalAmount: Number,
},{timestamps:true});

const OrderModel = mongoose.models.orders as mongoose.Model<Order> || mongoose.model("orders",orderSchema);
export default OrderModel;