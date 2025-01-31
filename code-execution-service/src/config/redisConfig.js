import Redis from "ioredis";
import envConfig from "./envConfig.js";

let redis;

try {
    redis = new Redis(envConfig.REDIS_URL, { maxRetriesPerRequest: null });
    console.log("Connected to Redis Successfully");
} catch (error) {
    console.error("Error in Redis Connection", error)
}

export default redis;