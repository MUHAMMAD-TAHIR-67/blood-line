
import express from "express";
import { 
    createRequest,
    getUserRequests,
    getIncomingRequests,
    respondToRequest,
    volunteerForRequest,
    getAllRequests,
    getRequestDetails,
    cancelRequest,
    getUrgentRequests
} from "../controllers/requestController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { authuser } from "../middleware/auth.js";

export const requestRouter = express.Router();

console.log("✅ requestRoutes.js loaded");
console.log("   volunteerForRequest:", typeof volunteerForRequest);

requestRouter.get("/urgent", getUrgentRequests);

requestRouter.post("/create", authuser, createRequest);
requestRouter.post("/my-requests", authuser, getUserRequests);
requestRouter.post("/details", authuser, getRequestDetails);
requestRouter.post("/cancel", authuser, cancelRequest);

requestRouter.post("/incoming", authuser, getIncomingRequests);
requestRouter.post("/respond", authuser, respondToRequest);
requestRouter.post("/volunteer", authuser, volunteerForRequest);  

requestRouter.post("/all", adminAuth, getAllRequests);

console.log("✅ All routes:");
requestRouter.stack.forEach(r => {
    if (r.route) {
        console.log(`   ${Object.keys(r.route.methods)} /api/requests${r.route.path}`);
    }
});