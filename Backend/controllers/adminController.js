// controllers/adminController.js
import { userModel } from "../models/userModel.js";
import { requestModel } from "../models/requestModel.js";

export const getDashboardStats = async (req, res) => {
    try {
        console.log("Fetching dashboard stats...");
        
        // User statistics
        const totalUsers = await userModel.countDocuments();
        console.log("Total users:", totalUsers);
        
        const totalDonors = await userModel.countDocuments({ isDonor: true });
        console.log("Total donors:", totalDonors);
        
        const verifiedDonors = await userModel.countDocuments({ 
            isDonor: true, 
            'donorInfo.verified': true 
        });
        
        const urgentDonors = await userModel.countDocuments({ 
            isDonor: true, 
            'donorInfo.urgent': true,
            'donorInfo.available': true 
        });

        // Request statistics
        const totalRequests = await requestModel.countDocuments();
        console.log("Total requests:", totalRequests);
        
        const pendingRequests = await requestModel.countDocuments({ status: 'pending' });
        const matchedRequests = await requestModel.countDocuments({ status: 'matched' });
        const fulfilledRequests = await requestModel.countDocuments({ status: 'fulfilled' });
        const cancelledRequests = await requestModel.countDocuments({ status: 'cancelled' });
        
        const urgentRequests = await requestModel.countDocuments({ 
            urgency: { $in: ['high', 'critical'] },
            status: 'pending'
        });

        // Blood group distribution
        const bloodGroupStats = await userModel.aggregate([
            { $match: { isDonor: true, bloodGroup: { $ne: '', $exists: true } } },
            { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Recent users (last 10)
        const recentUsers = await userModel.find()
            .select('name email isDonor bloodGroup createdAt phone address')
            .sort({ createdAt: -1 })
            .limit(10);

        // Recent requests (last 10)
        const recentRequests = await requestModel.find()
            .populate('requesterId', 'name email')
            .sort({ createdAt: -1 })
            .limit(10);

        // Send response
        res.json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    donors: totalDonors,
                    verified: verifiedDonors,
                    urgent: urgentDonors
                },
                requests: {
                    total: totalRequests,
                    pending: pendingRequests,
                    matched: matchedRequests,
                    fulfilled: fulfilledRequests,
                    cancelled: cancelledRequests,
                    urgent: urgentRequests
                },
                bloodGroupDistribution: bloodGroupStats,
                recentUsers: recentUsers,
                recentRequests: recentRequests
            }
        });
        
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.json({ 
            success: false, 
            message: error.message,
            stats: {
                users: { total: 0, donors: 0, verified: 0, urgent: 0 },
                requests: { total: 0, pending: 0, matched: 0, fulfilled: 0, cancelled: 0, urgent: 0 },
                bloodGroupDistribution: [],
                recentUsers: [],
                recentRequests: []
            }
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const { role, isDonor, search, page = 1, limit = 20 } = req.query;
        let filter = {};

        if (role && role !== 'all') filter.role = role;
        if (isDonor === 'true') filter.isDonor = true;
        if (isDonor === 'false') filter.isDonor = false;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        const users = await userModel.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await userModel.countDocuments(filter);

        res.json({
            success: true,
            users,
            pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        console.error("Get users error:", error);
        res.json({ success: false, message: error.message, users: [] });
    }
};

export const toggleDonorVerification = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        
        if (!user || !user.isDonor) {
            return res.json({ success: false, message: "Donor not found" });
        }

        user.donorInfo.verified = !user.donorInfo.verified;
        await user.save();

        res.json({ 
            success: true, 
            message: `Donor ${user.donorInfo.verified ? 'verified' : 'unverified'} successfully`,
            verified: user.donorInfo.verified
        });
    } catch (error) {
        console.error("Toggle verification error:", error);
        res.json({ success: false, message: error.message });
    }
};

export const toggleUrgentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        
        if (!user || !user.isDonor) {
            return res.json({ success: false, message: "Donor not found" });
        }

        user.donorInfo.urgent = !user.donorInfo.urgent;
        await user.save();

        res.json({ 
            success: true, 
            message: `Donor marked as ${user.donorInfo.urgent ? 'urgent' : 'normal'}`,
            urgent: user.donorInfo.urgent
        });
    } catch (error) {
        console.error("Toggle urgent error:", error);
        res.json({ success: false, message: error.message });
    }
};

export const toggleFeaturedStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        
        if (!user || !user.isDonor) {
            return res.json({ success: false, message: "Donor not found" });
        }

        user.donorInfo.featured = !user.donorInfo.featured;
        await user.save();

        res.json({ 
            success: true, 
            message: `Donor ${user.donorInfo.featured ? 'featured' : 'removed from featured'}`,
            featured: user.donorInfo.featured
        });
    } catch (error) {
        console.error("Toggle featured error:", error);
        res.json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Delete all requests by this user
        await requestModel.deleteMany({ requesterId: id });
        
        // Remove this user from donor lists in requests
        await requestModel.updateMany(
            { 'requests.donorId': id },
            { $pull: { requests: { donorId: id } } }
        );

        await userModel.findByIdAndDelete(id);

        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.json({ success: false, message: error.message });
    }
};

export const getAllBloodRequests = async (req, res) => {
    try {
        const { status, urgency, search, page = 1, limit = 20 } = req.query;
        let filter = {};

        if (status && status !== 'all') filter.status = status;
        if (urgency && urgency !== 'all') filter.urgency = urgency;
        if (search) {
            filter.$or = [
                { requestNumber: { $regex: search, $options: 'i' } },
                { requesterName: { $regex: search, $options: 'i' } },
                { 'patientInfo.name': { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        const requests = await requestModel.find(filter)
            .populate('requesterId', 'name email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await requestModel.countDocuments(filter);

        res.json({
            success: true,
            requests,
            pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        console.error("Get requests error:", error);
        res.json({ success: false, message: error.message, requests: [] });
    }
};

export const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const request = await requestModel.findById(id);
        if (!request) {
            return res.json({ success: false, message: "Request not found" });
        }

        request.status = status;
        
        if (status === 'fulfilled') {
            request.fulfilledDate = new Date();
            
            // Update donor's donation count
            if (request.matchedDonorId) {
                await userModel.findByIdAndUpdate(request.matchedDonorId, {
                    $inc: { 'donorInfo.donationCount': request.totalUnits || 1 },
                    $set: { 'donorInfo.lastDonationDate': new Date() }
                });
            }
        }

        await request.save();

        res.json({ success: true, message: `Request status updated to ${status}`, request });
    } catch (error) {
        console.error("Update request status error:", error);
        res.json({ success: false, message: error.message });
    }
};

export const deleteBloodRequest = async (req, res) => {
    try {
        const { id } = req.params;
        await requestModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Blood request deleted successfully" });
    } catch (error) {
        console.error("Delete request error:", error);
        res.json({ success: false, message: error.message });
    }
};