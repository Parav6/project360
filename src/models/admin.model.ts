import mongoose, {Document , Schema , Types} from "mongoose";

export interface Admin extends Document{
    _id:Types.ObjectId;
    name:string;
    email:string;
    password:string;
    role:"admin";
    phone:string;
    refreshToken:string;
    createdAt?: Date;
    updatedAt?: Date;
};

const adminSchema : Schema<Admin> = new Schema({
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
        default:"admin"
    },
    phone:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String
    }
},{timestamps:true});

const AdminModel = mongoose.models.admins as mongoose.Model<Admin> || mongoose.model("admins",adminSchema);

export default AdminModel;

