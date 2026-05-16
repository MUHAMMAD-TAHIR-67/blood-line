
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        street: String,
        city: String,
        state: String,
        zipcode: String
    },
    bloodGroup: { 
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
        default: ''
    },
    age: { type: Number },
    weight: { type: Number }, // in kg
    isDonor: { type: Boolean, default: false }, 
    donorInfo: {
        available: { type: Boolean, default: true },
        lastDonationDate: { type: Date },
        donationCount: { type: Number, default: 0 },
        medicalConditions: { type: String },
        description: { type: String },
        image: { type: Array, default: [] }, 
        verified: { type: Boolean, default: false },
        urgent: { type: Boolean, default: false },
        featured: { type: Boolean, default: false }
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'],
        default: 'user'
    },
    bloodRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'requests' }],
    createdAt: { type: Date, default: Date.now }
});

export const userModel = mongoose.models.users || mongoose.model("users", userSchema);