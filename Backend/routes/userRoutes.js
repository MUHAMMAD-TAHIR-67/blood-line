// routes/userRoutes.js
import express from "express";
import { 
    adminLogin, 
    getUserProfile, 
    Login, 
    register,
    updateUserProfile,
    getAllDonors,
    getSingleDonor,
    toggleDonorAvailability,
    getUrgentDonors
} from "../controllers/userController.js";
import { authuser } from "../middleware/auth.js";

const userRouter = express.Router();

console.log("✅ userRoutes.js loaded");
console.log("✅ getAllDonors imported:", typeof getAllDonors);

// ============ PUBLIC ROUTES ============

// Auth routes
userRouter.post("/register", register);
userRouter.post("/login", Login);
userRouter.post("/admin-login", adminLogin);

// Donor routes (public) - THIS IS THE IMPORTANT ONE
userRouter.get("/donors", getAllDonors);
userRouter.get("/donors/urgent", getUrgentDonors);
userRouter.post("/donors/single", getSingleDonor);

// ============ PROTECTED ROUTES ============

userRouter.post("/profile", authuser, getUserProfile);
userRouter.post("/update-profile", authuser, updateUserProfile);
userRouter.post("/toggle-availability", authuser, toggleDonorAvailability);

console.log("✅ userRouter configured with routes:");
userRouter.stack.forEach(r => {
    if (r.route) {
        console.log(`  ${Object.keys(r.route.methods)} /api/user${r.route.path}`);
    }
});

export { userRouter };