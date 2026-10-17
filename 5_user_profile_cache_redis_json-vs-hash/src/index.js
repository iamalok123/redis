import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");




app.post("/user/:id/json", async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;

    await redis.set(`user:${userId}:json`, JSON.stringify(userData));

    return res.json({ savesAs: "json" });
});

app.get("/user/:id/json", async (req, res) => {
    const raw = await redis.get(`user:${req.params.id}:json`);
    res.json({ user: raw ? JSON.parse(raw) : null });
});





app.post("/user/:id/hash", async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;

    await redis.hset(`user:${userId}:hash`, userData);

    return res.json({ savesAs: "hash" });
});

app.get("/user/:id/hash", async (req, res) => {
    const raw = await redis.hgetall(`user:${req.params.id}:hash`);
    res.json({ user: raw });
});




app.listen(3000, () => {
    console.log("Server is running on port 3000");
});