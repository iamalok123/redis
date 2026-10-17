import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redis.on("error", (err) => {
    console.error("[ioredis] Connection error:", err.message);
});

function otpKey(phone) {
    return `otp:${phone}`;
}

app.post('/otp', async (req, res) => {
    const { phone } = req.body || {};
    if (!phone) {
        return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    
    await redis.set(otpKey(phone), otp, "EX", 60);

    res.json({ success: true, message: `OTP sent to ${phone}`, otp });
});

app.post('/otp/verify', async (req, res) => {
    const { phone, otp } = req.body || {};
    if (!phone || !otp) {
        return res.status(400).json({ success: false, message: "Phone and OTP are required" });
    }

    const storedOtp = await redis.get(otpKey(phone));

    if (!storedOtp) {
        return res.status(400).json({ success: false, message: "OTP is expired or invalid" });
    }

    if (String(storedOtp) !== String(otp)) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    await redis.del(otpKey(phone));
    res.json({ success: true, message: "OTP verified successfully" });
});

app.get('/otp/:phone/ttl', async (req, res) => {
    const ttl = await redis.ttl(otpKey(req.params.phone));
    res.json({ success: true, ttl });
});



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
