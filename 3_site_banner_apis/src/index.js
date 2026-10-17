import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";


const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");


const BANNER_KEY = "app:banner";

app.post("/banner", async(req, res) => {
    await redis.set(BANNER_KEY, req.body?.message || "Welcome to home page");
    res.json({success: true});
})

app.get("/banner", async(req, res) => {
    const banner = await redis.get(BANNER_KEY);
    res.json({success: true, message: banner});
})

app.delete("/banner", async(req, res) => {
    await redis.del(BANNER_KEY);
    res.json({success: true});
})

app.get("/banner/exists", async(req, res) => {
    const exists = await redis.exists(BANNER_KEY);
    res.json({success: true, exists: !!exists});  
    // Or - exists: Boolean(exists)
    // Returns 1 if exists , 0 if not
})


app.listen(3000, () => {
    console.log("server is running on port 3000");
})