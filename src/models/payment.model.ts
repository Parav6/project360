import mongoose , {Schema,Document,Types} from "mongoose";

export interface Payment extends Document{
    orderId:Types.ObjectId;
    razorpayOrderId:string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    status:"success" | "failed" |"pending";
    amount:number
};

export const paymentSchema : Schema<Payment> = new Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'orders' 
    },
    razorpayOrderId:{
        type:String,
        
    },
    razorpayPaymentId:{
        type:String,
       
    },
    razorpaySignature:{
        type:String,
       
    },
    status: { 
        type: String, 
        enum: ['success', 'failed', 'pending'], 
        default: 'pending' 
    },
    amount:{
        type:Number,
        required:true
    }
},{timestamps:true});

const PaymentModel = mongoose.models.payments as mongoose.Model<Payment> || mongoose.model<Payment>("payments",paymentSchema);
export default PaymentModel;