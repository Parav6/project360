import mongoose, {Document, Schema, Types} from "mongoose";
import { Address } from "./customer.model";
import { addressSchema } from "./customer.model";

export interface Employee extends Document{
    _id:Types.ObjectId;
    name:string;
    email:string;
    password:string;
    role:"employee";
    phone:string;
    addresses:Address[];
    refreshToken:string;
    isVerified:boolean;
    isWorking:boolean;
    workingFor:Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
};

const employeeSchema : Schema<Employee> = new Schema({
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
        default:"employee"
    },
    phone:{
        type:String,
        required:true,
    },
    addresses:[addressSchema],

    isVerified:{
        type:Boolean,
        default:false
    },
    refreshToken:{
        type:String
    },
    isWorking:{
        type:Boolean,
        default:false
    },
    workingFor:{
        type:Schema.Types.ObjectId,
        ref:"orders"
    }
},{timestamps:true});

const EmployeeModel = mongoose.models.employees as mongoose.Model<Employee> || mongoose.model<Employee>("employees", employeeSchema);

export default EmployeeModel;