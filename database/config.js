import mongoose from "mongoose";
import { config as configDotenv } from "dotenv";

async function connectToDatabase(){
    configDotenv();
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB!");
}

export default connectToDatabase;