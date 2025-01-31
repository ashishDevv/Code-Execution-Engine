import dotenv from "dotenv";

dotenv.config();

export default {
    PORT: process.env.PORT,

    REDIS_URL: process.env.REDIS_URL,

    MONGODB_URI: process.env.MONGODB_URI,

    DATABASE_NAME: process.env.DATABASE_NAME,

    BULLMQ_QUEUE_NAME: process.env.BULLMQ_QUEUE_NAME,
}
