import mongoose,{Schema,Document, Types} from "mongoose";

export interface Rating extends Document{
    _id:Types.ObjectId;
    user:Types.ObjectId;
    rating:number;
    comment?:string;
    createdAt?:Date;
    updatedAt?:Date;
};

export interface Image extends Document{
  _id:Types.ObjectId;
  publicId:string;
  url:string;
  createdAt?:Date;
  updatedAt?:Date;
};

const ratingSchema = new Schema({
    user:{
        type:Types.ObjectId,
        ref:"customers",
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:0
    },
    comment:{
        type:String,
    }
},{timestamps:true});

const imageSchema = new Schema({
  publicId:{
    type:String
  },
  url:{
    type:String
  }
},{timestamps:true})

export interface Products extends Document{
    _id:Types.ObjectId;
    name:string;
    description:string;
    price:number;
    discount?:number;
    stock:number;
    category:string;
    tags?:string[];
    images:Image[];
    isDeleted:boolean;
    ratings:Rating[];
    createdAt?:Date;
    updatedAt?:Date;
};

const productSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      index:true
    },
    discount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    tags:[
        {type:String}
    ],
    images:[imageSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    rating:[ratingSchema]
},{timestamps:true});

const ProductModel = mongoose.models.products as mongoose.Model<Products> || mongoose.model("products",productSchema);
export default ProductModel;