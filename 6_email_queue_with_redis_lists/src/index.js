import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");


const QUEUE_KEY = "queue:emails" ;


app.post("/emails", async(req,res) => {
    const {to , subject , body} = req.body;

    const emailJob = {
        to: to , 
        subject: subject || "No Subject", 
        body: body || "No Body",
        createdAt : new Date().toISOString()
    };

    await redis.lpush(QUEUE_KEY, JSON.stringify(emailJob));  // Push from left and pop from right
    res.status(201).json({message : "Email added to queue", queue: true, job: emailJob});
})


app.get("/emails/process-one", async(req, res) => {
    const job = await redis.rpop(QUEUE_KEY);

    if (!job){
        return res.json({message : "No jobs in queue"});
    }

    const emailJob = JSON.parse(job);
    return res.json({message : "Email job", job : emailJob});
})



app.listen(3000, () => {
    console.log("Server running on port 3000");
})