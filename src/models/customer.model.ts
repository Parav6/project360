import mongoose , {Document , Schema, Types}from "mongoose";


export interface Address extends Document{
    label:string;      // gives a name to this address
    street:string,
    city:string;
    state:string;
    postalCode:string;
    country:string
};

export const addressSchema : Schema<Address> = new Schema({
    label:{
        type:String,
        required:true,
    },
    street:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    postalCode:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    }
}, {timestamps:true});

export interface Customer extends Document{
    _id:Types.ObjectId;
    name:string;
    email:string;
    password:string;
    role:"customer";
    phone:string;
    addresses:Address[];
    wishlist:Types.ObjectId[];
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    refreshToken:string,
    createdAt?: Date;
    updatedAt?: Date;
};

const customerSchema : Schema<Customer> = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"customer"
    },
    phone:{
        type:String,
        required:true,
    },
    addresses:[addressSchema],

    wishlist:[{type:Types.ObjectId, ref:"products"}],

    verifyCode:{
        type:String,
        required:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:true,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    refreshToken:{
        type:String
    }

},{timestamps:true});

const CustomerModel = mongoose.models.customers as mongoose.Model<Customer> || mongoose.model<Customer>("customers", customerSchema);

export default CustomerModel;