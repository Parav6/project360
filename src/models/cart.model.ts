import mongoose,{Schema,Document,Types} from "mongoose";


export interface CartItems extends Document{
    _id:Types.ObjectId
    product:Types.ObjectId;
    quantity:number;
    createdAt?: Date;
    updatedAt?: Date;
};

const cartItemsSchema: Schema<CartItems> = new Schema({
    product:{
        type:Schema.Types.ObjectId,
        ref:"products",
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    }
},{timestamps:true});

export interface Cart extends Document{
    _id:Types.ObjectId
    user:Types.ObjectId;
    items:CartItems[];
    createdAt?: Date;
    updatedAt?: Date;
};

const cartSchema: Schema<Cart> = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    items:[cartItemsSchema]
},{timestamps:true});

const CartModel = mongoose.models.carts as mongoose.Model<Cart> || mongoose.model("carts",cartSchema);

export default CartModel;

