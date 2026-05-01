// models/requestModel.js
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    requesterName: { type: String, required: true },
    requesterEmail: { type: String, required: true },
    requesterPhone: { type: String, required: true },
    
    // Patient Information
    patientInfo: {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        bloodGroup: { type: String, required: true },
        hospital: { type: String, required: true },
        city: { type: String },
        doctorName: { type: String },
        reason: { type: String },
        additionalNotes: { type: String }
    },
    
    // Blood Requests - Each donor requested
    requests: [{
        donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        donorName: { type: String },
        bloodGroup: { type: String },
        units: { type: Number, default: 1, min: 1, max: 10 },
        // NEW: Donor response fields
        donorStatus: { 
            type: String, 
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        donorResponseDate: { type: Date },
        donorNotes: { type: String }
    }],
    
    totalUnits: { type: Number, default: 0 },
    urgency: { 
        type: String, 
        enum: ['normal', 'high', 'critical'],
        default: 'normal'
    },
    status: { 
        type: String, 
        enum: ['pending', 'partially_accepted', 'matched', 'fulfilled', 'cancelled', 'expired'],
        default: 'pending'
    },
    matchedDonorId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    matchedDate: { type: Date },
    fulfilledDate: { type: Date },
    requestNumber: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
});

// Auto-set expiry
requestSchema.pre('save', function(next) {
    if (!this.expiresAt) {
        const days = this.urgency === 'critical' ? 3 : (this.urgency === 'high' ? 5 : 7);
        this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }
    if (this.requests && this.requests.length > 0) {
        this.totalUnits = this.requests.reduce((sum, req) => sum + (req.units || 0), 0);
    }
    next();
});

export const requestModel = mongoose.models.requests || mongoose.model("requests", requestSchema);