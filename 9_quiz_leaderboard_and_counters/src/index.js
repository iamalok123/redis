import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redis.on("error", (err) => {
    console.error("[ioredis] Connection error:", err.message);
});

const LEADERBOARD_KEY = "leaderboard";



// 1. POST /posts/:id/view - Increment post views
app.post("/posts/:id/view", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Post ID is required" });
        }

        const views = await redis.incr(`post:${id}:views`);

        res.json({
            postId: id,
            views,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 2. POST /leaderboard/score - Add points to a user's score
app.post("/leaderboard/score", async (req, res) => {
    try {
        const { userId, points } = req.body || {};

        if (!userId || points === undefined || isNaN(Number(points))) {
            return res.status(400).json({
                error: "userId and a valid numeric points value are required",
            });
        }

        const score = await redis.zincrby(LEADERBOARD_KEY, Number(points), userId);

        res.json({
            userId,
            score: Number(score),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 3. GET /leaderboard - Return top 10 users, highest score first
app.get("/leaderboard", async (req, res) => {
    try {
        // ZREVRANGE leaderboard 0 9 WITHSCORES
        // Returns flat array: [userId1, score1, userId2, score2, ...]
        const values = await redis.zrevrange(LEADERBOARD_KEY, 0, 9, "WITHSCORES");

        const leaderboard = [];
        for (let i = 0; i < values.length; i += 2) {
            leaderboard.push({
                rank: i / 2 + 1,
                userId: values[i],
                score: Number(values[i + 1]),
            });
        }

        res.json({ leaderboard });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 4. GET /leaderboard/:userId/rank - Return a user's rank and score
app.get("/leaderboard/:userId/rank", async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // ZREVRANK returns 0-based rank, or null if user doesn't exist
        const zeroBasedRank = await redis.zrevrank(LEADERBOARD_KEY, userId);

        if (zeroBasedRank === null) {
            return res.status(404).json({
                error: "User is not on the leaderboard",
                userId,
            });
        }

        const score = await redis.zscore(LEADERBOARD_KEY, userId);

        res.json({
            userId,
            rank: zeroBasedRank + 1,
            score: score !== null ? Number(score) : null,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
