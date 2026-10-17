import { Worker } from "bullmq";
import { connection } from "./queue.js";

const worker = new Worker(
    "emails",
    async (job) => {
        console.log("Processing Email Job...", job.id, job.name, job.data);
        
        const { to, name, email, orderId } = job.data;

        if (job.name === "order_confirmation") {
            console.log(`Sending order confirmation email to ${email} for order ${orderId}`);
        } else if (job.name === "welcome_email") {
            console.log(`Sending welcome email to ${name} (${to})`);
        } else {
            console.log(`Processing job ${job.name} for ${to || email}`);
        }

        // Simulate sending email (2-second delay)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Email job completed...", job.id, job.name, job.data);
    }, 
    { connection }
);

worker.on("completed", (job) => {
    console.log("Job completed:", job.id, job.name, job.data)
})

worker.on("failed", (job, error) => {
    console.log("Job failed:", job.id, job.name, job.data, error)
})

worker.on("error", (error) => {
    console.log("Error:", error)
})

worker.on("drained", () => {
    console.log("All jobs processed")
})