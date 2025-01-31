import envConfig from "./config/envConfig.js"

import express from "express";
import codeSubmissionRouter from "./routes/index.js";
import connectDB from "./config/dbConfig.js";


export const app = express();

app.use(express.json());


app.use("/api", codeSubmissionRouter);

app.get("/test", (req, res) => {     // To test if the server is running correctly
    res.send("Hello World");
});



async function startServer(){
    try {
        await connectDB();
        console.log("Connected to MongoDB Successfully"); 
        

        app.listen(envConfig.PORT, () => {
            console.log(`Code Submission Service is running on port ${envConfig.PORT}`);
        });
    } catch (error) {
        console.error("Error in Server Startup", error);
        process.exit(1);
    }
}

startServer();

