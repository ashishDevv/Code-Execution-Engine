import envConfig from "./config/envConfig.js";

import express from "express";
import dbConfig from "./config/dbConfig.js";
import redisConnection from "./config/redisConfig.js";    // To 
import jobWorker from "./workers/jobWorker.js";
import { pullImage } from "./containers/dockerHelper.js";
import { PYTHON_IMAGE, JAVA_IMAGE } from "./containers/images.js";



const app = express();

const images = [ PYTHON_IMAGE, JAVA_IMAGE ]     // Just put the image in this array ,



async function startServer(){
    try {
        await dbConfig.connectToDb()
        console.log("Connected to MongoDB Successfully"); 

        
        // image pull 
        await Promise.all(images.map((image) => {
            return pullImage(image)
        }))
        console.log("All Images Pulled Successfully");

        app.listen(envConfig.PORT, () => {
            console.log(`Code Execution Service is running on port ${envConfig.PORT}`);
        });
    } catch (error) {
        console.error("Error in Server Startup", error);
        process.exit(1);
    }
}

startServer();