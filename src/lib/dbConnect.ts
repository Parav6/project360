import mongoose from "mongoose";

type dbConnection = {
    isConnected?:number
};

const connection : dbConnection = {};   //objects are passed by reference.

const dbConnect = async()=>{
    if(connection.isConnected){
        console.log("already connected to db");
        return 
    };
    try {
        const res = await mongoose.connect(process.env.MONGO_URL || "" );
        connection.isConnected = res.connections[0].readyState;
        console.log("db connected successfully.")
    } catch (error: unknown) {
        console.log("unable to connect to db")
        console.log(error);
        process.exit(1);
    }
};

export default dbConnect;