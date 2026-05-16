
import { requestModel } from "../models/requestModel.js";
import { userModel } from "../models/userModel.js";
import Counter from '../models/counter.js';

export const createRequest = async (req, res) => {
    try {
        let counter = await Counter.findOneAndUpdate(
            { name: 'requestNumber' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );

        const { patientInfo, requests } = req.body;
        const userId = req.userId;
        
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const enrichedRequests = [];
        for (const reqItem of requests) {
            if (reqItem.donorId) {
                const donor = await userModel.findOne({ 
                    _id: reqItem.donorId, 
                    isDonor: true,
                    'donorInfo.available': true 
                });
                
                if (!donor) {
                    return res.json({ 
                        success: false, 
                        message: `Donor is not available at the moment` 
                    });
                }
                enrichedRequests.push({
                    donorId: donor._id,
                    donorName: donor.name,
                    bloodGroup: donor.bloodGroup || reqItem.bloodGroup,
                    units: reqItem.units || 1,
                    donorStatus: 'pending'
                });
            }
        }

        const requestData = {
            requesterId: userId,
            requesterName: user.name,
            requesterEmail: user.email,
            requesterPhone: user.phone,
            patientInfo,
            requests: enrichedRequests,
            totalUnits: enrichedRequests.reduce((sum, r) => sum + (r.units || 0), 0),
            urgency: patientInfo.urgency || 'normal',
            status: 'pending',
            requestNumber: `REQ-${counter.value.toString().padStart(6, '0')}`,
            createdAt: new Date()
        };

        const newRequest = new requestModel(requestData);
        await newRequest.save();

        user.bloodRequests.push(newRequest._id);
        await user.save();

        res.json({ 
            success: true, 
            message: "Blood request submitted successfully! Donors will be notified.", 
            request: newRequest 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export const getUserRequests = async (req, res) => {
    try {
        const userId = req.userId;
        const requests = await requestModel.find({ requesterId: userId }).sort({ createdAt: -1 });
        res.json({ success: true, requests });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export const getIncomingRequests = async (req, res) => {
    try {
        const userId = req.userId;
        console.log("Getting incoming requests for donor:", userId);
        
        const requests = await requestModel.find({
            'requests.donorId': userId
        }).sort({ createdAt: -1 });
        
        console.log(`Found ${requests.length} incoming requests`);
        res.json({ success: true, requests });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export const respondToRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const { requestId, donorStatus, donorNotes } = req.body;
        
        console.log("Respond to request:", { requestId, donorStatus, userId });
        
        const request = await requestModel.findById(requestId);
        if (!request) {
            return res.json({ success: false, message: "Request not found" });
        }
        
        const donorEntry = request.requests.find(
            r => r.donorId.toString() === userId.toString()
        );
        
        if (!donorEntry) {
            return res.json({ success: false, message: "You are not part of this request" });
        }
        
        if (donorEntry.donorStatus !== 'pending') {
            return res.json({ success: false, message: `You already ${donorEntry.donorStatus} this request` });
        }
        
        donorEntry.donorStatus = donorStatus;
        donorEntry.donorResponseDate = new Date();
        if (donorNotes) donorEntry.donorNotes = donorNotes;
        
        if (donorStatus === 'accepted') {
            request.status = 'matched';
            request.matchedDonorId = userId;
            request.matchedDate = new Date();
            
            const donor = await userModel.findById(userId);
            if (donor && donor.isDonor) {
                donor.donorInfo.donationCount = (donor.donorInfo.donationCount || 0) + (donorEntry.units || 0);
                donor.donorInfo.lastDonationDate = new Date();
                await donor.save();
            }
        }
        
        await request.save();
        
        res.json({ 
            success: true, 
            message: `You have ${donorStatus} the blood request`,
            request 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export const getAllRequests = async (req, res) => {
    try {
        const { status, urgency, page = 1, limit = 20 } = req.body;
        let filter = {};
        
        if (status) filter.status = status;
        if (urgency) filter.urgency = urgency;
        
        const skip = (page - 1) * limit;
        const requests = await requestModel.find(filter)
            .sort({ urgency: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await requestModel.countDocuments(filter);
        
        res.json({ 
            success: true, 
            requests,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export const getRequestDetails = async (req, res) => {
    try {
        const { id } = req.body;
        const request = await requestModel.findById(id);
        if (!request) {
            return res.json({ success: false, message: "Request not found" });
        }
        res.json({ success: true, request });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export const getUrgentRequests = async (req, res) => {
    try {
        const requests = await requestModel.find({ 
            urgency: { $in: ['high', 'critical'] }, 
            status: 'pending' 
        }).sort({ urgency: -1, createdAt: 1 }).limit(10);
        
        res.json({ success: true, requests });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export const cancelRequest = async (req, res) => {
    try {
        const { id } = req.body;
        const request = await requestModel.findById(id);
        
        if (!request) {
            return res.json({ success: false, message: "Request not found" });
        }
        
        if (request.status === 'fulfilled') {
            return res.json({ success: false, message: "Cannot cancel fulfilled request" });
        }
        
        request.status = 'cancelled';
        await request.save();
        
        res.json({ success: true, message: "Request cancelled successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
export const volunteerForRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const { requestId } = req.body;

        console.log("Volunteer for request:", { requestId, userId });

        const donor = await userModel.findById(userId);
        if (!donor || !donor.isDonor) {
            return res.json({ 
                success: false, 
                message: "You must be a registered donor to help" 
            });
        }

        const request = await requestModel.findById(requestId);
        if (!request) {
            return res.json({ success: false, message: "Request not found" });
        }

        const existingEntry = request.requests.find(
            r => r.donorId.toString() === userId.toString()
        );

        if (existingEntry) {
            return res.json({ 
                success: false, 
                message: "You are already part of this request" 
            });
        }

        if (request.status !== 'pending') {
            return res.json({ 
                success: false, 
                message: `This request is already ${request.status}` 
            });
        }

        request.requests.push({
            donorId: userId,
            donorName: donor.name,
            bloodGroup: donor.bloodGroup,
            units: 1, 
            donorStatus: 'pending'
        });

        request.totalUnits = request.requests.reduce((sum, r) => sum + (r.units || 0), 0);

        await request.save();

        console.log(`✅ Donor ${donor.name} volunteered for request ${request.requestNumber}`);

        res.json({ 
            success: true, 
            message: "You have volunteered to help! The request is now in your incoming requests.",
            request 
        });

    } catch (error) {
        console.log("Volunteer error:", error);
        res.json({ success: false, message: error.message });
    }
};

console.log("✅ requestController.js loaded with all exports");