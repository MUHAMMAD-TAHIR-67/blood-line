// routes/adminRoutes.js
import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { 
    getDashboardStats,
    getAllUsers,
    toggleDonorVerification,
    toggleUrgentStatus,
    toggleFeaturedStatus,
    deleteUser,
    getAllBloodRequests,
    updateRequestStatus,
    deleteBloodRequest
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Dashboard
adminRouter.get("/dashboard", adminAuth, getDashboardStats);

// User Management
adminRouter.get("/users", adminAuth, getAllUsers);
adminRouter.delete("/users/:id", adminAuth, deleteUser);

// Donor Management
adminRouter.post("/donors/:id/verify", adminAuth, toggleDonorVerification);
adminRouter.post("/donors/:id/urgent", adminAuth, toggleUrgentStatus);
adminRouter.post("/donors/:id/featured", adminAuth, toggleFeaturedStatus);

// Blood Request Management
adminRouter.get("/requests", adminAuth, getAllBloodRequests);
adminRouter.put("/requests/:id/status", adminAuth, updateRequestStatus);
adminRouter.delete("/requests/:id", adminAuth, deleteBloodRequest);

export { adminRouter };