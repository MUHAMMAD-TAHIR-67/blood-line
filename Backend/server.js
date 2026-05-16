// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/MONGODB.js";
import { userRouter } from "./routes/userRoutes.js";
import { requestRouter } from "./routes/requestRoutes.js";
import { adminRouter } from "./routes/adminRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    credentials: true,
}));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

connectDB();

app.use("/api/user", userRouter);
app.use("/api/requests", requestRouter);
app.use("/api/admin", adminRouter); 

app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: "Blood Donation Platform API is running",
        version: "2.0.0"
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Something went wrong!" });
});

app.listen(port, () => {
    console.log(` Server running on port: ${port}`);
    console.log(`📡 API URL: http://localhost:${port}\n`);
    console.log("Available routes:");
    console.log("  - /api/user/*");
    console.log("  - /api/requests/*");
    console.log("  - /api/admin/*");
});