import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv();

const mongouri = process.env.MONGO_URI;

export const connectdb = async()=>{
    try {
        await mongoose.connect(mongouri);
        console.log('Db connected')
    } catch (error) {
        console.log('Db connection failed => ',error);
        process.exit(1);
    }
}