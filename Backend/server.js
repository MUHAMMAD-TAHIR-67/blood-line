// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/MONGODB.js";
import { connectCloudinary } from "./config/cloudinary.js";
import { userRouter } from "./routes/userRoutes.js";
import { requestRouter } from "./routes/requestRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    credentials: true,
}));

// Debug middleware - logs all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Connect to databases
connectDB();
connectCloudinary();

// API Routes
app.use("/api/user", userRouter);
app.use("/api/requests", requestRouter);

// Debug: Print all registered routes
console.log("\n📋 Registered Routes:");
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
        middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
                console.log(`${Object.keys(handler.route.methods)} /api/user${handler.route.path}`);
            }
        });
    }
});
console.log("");

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: "Blood Donation Platform API is running",
        version: "2.0.0"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
    console.log(`\n🩸 Server running on port: ${port}`);
    console.log(`📡 API URL: http://localhost:${port}\n`);
});