import { Worker } from "bullmq";
import envConfig from "../config/envConfig.js"
import redisConnection from "../config/redisConfig.js";
import jobHandler from "../services/codeExecutionService.js";

let worker;

async function startWorker() {
    try {

        worker = new Worker(envConfig.BULLMQ_QUEUE_NAME, jobHandler, { 
            connection: redisConnection,
            concurrency: 5
        });
        
        console.log("Worker initialized successfully");


        worker.on('error', (err) => {           // This emit when there is an error in BullMQ, like queue, redis connection errors, etc
            console.error("Worker error:", err);
        });

        worker.on('failed', (job, err) => {      // This emit when our jobHandler throws an error
            console.error(`Job ${job.id} failed:`, err);
        });

        worker.on('completed', ( job ) => {       // This emit when our jobHandler returns a success, means when job completed without any errors
            console.log(`Job ${job.id} completed successfully`);
        });

        worker.on('retrying', (job, err) => {     // this emit when worker is retrying a job
            console.log(
                `Retrying job ${job.id}. Attempt ${job.attemptsMade + 1} of ${job.opts.attempts}. ` +
                `Next attempt in ${job.opts.backoff.delay}ms`
            );
        });

        worker.on('active', ( job ) => {           // This emit when a job is started by worker
            console.log(`Job ${job.id} has started`);
        });

    } catch (error) {
        console.error("Error in starting worker:", error);
    }
}

startWorker();

export default worker;