// routes/requestRoutes.js
import express from "express";
import { 
    createRequest,
    getUserRequests,
    getIncomingRequests,
    respondToRequest,
    volunteerForRequest,  // ← MAKE SURE THIS IS IMPORTED
    getAllRequests,
    getRequestDetails,
    cancelRequest,
    getUrgentRequests
} from "../controllers/requestController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { authuser } from "../middleware/auth.js";

export const requestRouter = express.Router();

// Debug: Check what's imported
console.log("✅ requestRoutes.js loaded");
console.log("   volunteerForRequest:", typeof volunteerForRequest);

// Public routes
requestRouter.get("/urgent", getUrgentRequests);

// User routes (authenticated)
requestRouter.post("/create", authuser, createRequest);
requestRouter.post("/my-requests", authuser, getUserRequests);
requestRouter.post("/details", authuser, getRequestDetails);
requestRouter.post("/cancel", authuser, cancelRequest);

// Donor routes (authenticated)
requestRouter.post("/incoming", authuser, getIncomingRequests);
requestRouter.post("/respond", authuser, respondToRequest);
requestRouter.post("/volunteer", authuser, volunteerForRequest);  // ← THIS MUST BE HERE

// Admin routes
requestRouter.post("/all", adminAuth, getAllRequests);

// Print all routes
console.log("✅ All routes:");
requestRouter.stack.forEach(r => {
    if (r.route) {
        console.log(`   ${Object.keys(r.route.methods)} /api/requests${r.route.path}`);
    }
});