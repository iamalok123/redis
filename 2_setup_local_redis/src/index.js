import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";


const app = express();
app.use(express.json());


const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.get("/redis", async (req, res) => {
    const reply = await redis.ping();
    res.json({ redis: reply });
});

app.get("/mongo", async (req, res) => {
    const url = process.env.MONGO_URL || "mongodb://localhost:27017/chai_aur_redis";
    await mongoose.connect(url);
    res.json({ mongoose: "connected" });
});



app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
