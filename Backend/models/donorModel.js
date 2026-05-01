// models/donorModel.js
import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    bloodGroup: { 
        type: String, 
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    city: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true }, // in kg, minimum 50kg
    lastDonationDate: { type: Date },
    available: { type: Boolean, default: true },
    urgent: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    image: { type: Array, default: [] },
    description: { type: String },
    medicalConditions: { type: String }, // Any medical conditions
    donationCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false } // Verified by admin
});

export const donorModel = mongoose.models.donors || mongoose.model("donors", donorSchema);