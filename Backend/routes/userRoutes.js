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
    getUrgentDonors,
    getDonationHistory  // ADD THIS IMPORT
} from "../controllers/userController.js";
import { authuser } from "../middleware/auth.js";

const userRouter = express.Router();

console.log("✅ userRoutes.js loaded");

// ============ PUBLIC ROUTES ============
userRouter.post("/register", register);
userRouter.post("/login", Login);
userRouter.post("/admin-login", adminLogin);
userRouter.get("/donors", getAllDonors);
userRouter.get("/donors/urgent", getUrgentDonors);
userRouter.post("/donors/single", getSingleDonor);

userRouter.post("/profile", authuser, getUserProfile);
userRouter.post("/update-profile", authuser, updateUserProfile);
userRouter.post("/toggle-availability", authuser, toggleDonorAvailability);
userRouter.get("/donation-history", authuser, getDonationHistory);  

console.log("✅ userRouter configured with routes:");

export { userRouter };