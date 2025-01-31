import mongoose from "mongoose";
import envConfig from "./envConfig.js"



async function connectDB() {
    try {
        await mongoose.connect(envConfig.MONGODB_URI);
        console.log("Connected to MongoDB Successfully");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        throw error;
    }
};

export default connectDB;
