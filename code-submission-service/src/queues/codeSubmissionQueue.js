import { Queue } from "bullmq";
import envConfig from "../config/envConfig.js";
import Redis from "ioredis";



function createCodeSubmissionQueue() {
    try {
        const redisClient = new Redis(envConfig.REDIS_URL);
        console.log("Redis Client Created Successfully");

        const codeSubmissionQueue = new Queue(envConfig.BULLMQ_QUEUE_NAME, {
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 1000
                }
            },
            connection: redisClient
        })

        console.log("Code Submission Queue Created Successfully");
        return codeSubmissionQueue;

    } catch (error) {
        console.error("Error in creating Code Submission Queue", error);
    }
}



export default createCodeSubmissionQueue();    // Export the function after calling , so that we only create one instance of the queue
