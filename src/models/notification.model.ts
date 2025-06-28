import mongoose, {Schema,Document} from "mongoose";

export interface Notification extends Document{
    heading:string;
    message:string;
};

const notificationSchema: Schema<Notification> = new Schema({
    heading:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    }
},{timestamps:true});

const NotificationModel = mongoose.models.notifications as mongoose.Model<Notification> || mongoose.model("notifications",notificationSchema);
export default NotificationModel;