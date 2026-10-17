import express from "express";
import { emailQueue } from "./queue.js";

const app = express();

app.use(express.json());

app.post("/welcome-email", async (req, res) => {
    const { to, name } = req.body || {};
    if (!to) {
        return res.status(400).json({ error: "Email 'to' field is required" });
    }

    const job = await emailQueue.add(
        "welcome_email", 
        { to, name: name || "User" },
        {
            attempts: 5,
            backoff: {
                type: "exponential",
                delay: 2000
            }
        }
    );
    res.json({ message: "Welcome email job added to queue", jobId: job.id });
});

app.post("/order-confirmation", async (req, res) => {
    const { email, orderId } = req.body || {};
    if (!email || !orderId) {
        return res.status(400).json({ error: "Fields 'email' and 'orderId' are required" });
    }

    const job = await emailQueue.add(
        "order_confirmation",
        { email, orderId },
        {
            attempts: 5,
            backoff: {
                type: "exponential",
                delay: 2000
            }
        }
    );
    res.json({ message: "Order confirmation job added to queue", jobId: job.id });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

export default app;