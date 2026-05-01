// routes/donorRoutes.js
import express from "express";
import { 
    addDonor, 
    listDonors, 
    removeDonor, 
    singleDonor,
    updateDonor,
    toggleAvailability,
    getUrgentDonors,
    getDonorsByBloodGroup
} from "../controllers/donorController.js";
import { upload } from "../middleware/multer.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { authuser } from "../middleware/auth.js";

export const donorRoutes = express.Router();

// Public routes (no authentication needed)
donorRoutes.get("/list", listDonors);
donorRoutes.get("/urgent", getUrgentDonors);
donorRoutes.post("/single", singleDonor);
donorRoutes.post("/by-bloodgroup", getDonorsByBloodGroup);

// Protected routes (User authentication required)
donorRoutes.post("/toggle-availability", authuser, toggleAvailability);

// Admin only routes
donorRoutes.post("/add", adminAuth, upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
]), addDonor);

donorRoutes.post("/remove", adminAuth, removeDonor);
donorRoutes.post("/update", adminAuth, updateDonor);