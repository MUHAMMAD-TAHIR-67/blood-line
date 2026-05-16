
import validator from "validator";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";
import { requestModel } from "../models/requestModel.js";
import bcrypt from "bcrypt";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_S);
};

export const Login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.json({ success: false, message: "Email and password are required" });
    }
    
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }
        
        const token = createToken(user._id);
        
        res.json({ 
            success: true, 
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                bloodGroup: user.bloodGroup,
                isDonor: user.isDonor,
                address: user.address,
                donorInfo: user.donorInfo,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.json({ success: false, message: error.message });
    }
};

export const register = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            password, 
            phone, 
            address,
            bloodGroup,
            age,
            weight,
            medicalConditions,
            description,
            city,
            wantToBeDonor
        } = req.body;
        
        console.log("Registration data:", { name, email, wantToBeDonor });
        
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: "User already exists with this email" });
        }
        
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }
        
        if (!phone || phone.length < 10) {
            return res.json({ success: false, message: "Please enter a valid phone number (min 10 digits)" });
        }
        
        if (wantToBeDonor) {
            if (!bloodGroup) {
                return res.json({ success: false, message: "Please select a blood group" });
            }
            if (!age || age < 18 || age > 65) {
                return res.json({ success: false, message: "Age must be between 18 and 65 years" });
            }
            if (!weight || weight < 50) {
                return res.json({ success: false, message: "Minimum weight required is 50 kg" });
            }
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const userData = {
            name,
            email,
            password: hashedPassword,
            phone,
            address: address || {},
            isDonor: wantToBeDonor || false,
            role: 'user'
        };
        
        if (wantToBeDonor) {
            userData.bloodGroup = bloodGroup;
            userData.age = Number(age);
            userData.weight = Number(weight);
            userData.donorInfo = {
                available: true,
                donationCount: 0,
                medicalConditions: medicalConditions || '',
                description: description || '',
                image: [],
                verified: false,
                urgent: false,
                featured: false
            };
            
            if (city) {
                userData.address.city = city;
            }
        }
        
        const user = new userModel(userData);
        await user.save();
        
        const token = createToken(user._id);
        
        res.json({ 
            success: true, 
            message: wantToBeDonor ? "Registration successful! You are now a donor." : "Registration successful!",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                bloodGroup: user.bloodGroup,
                isDonor: user.isDonor,
                address: user.address,
                donorInfo: user.donorInfo,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error("Registration error:", error);
        res.json({ success: false, message: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId).select('-password');
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        const myRequests = await requestModel.find({ requesterId: userId })
            .sort({ createdAt: -1 })
            .limit(10);
        
        res.json({ 
            success: true, 
            user,
            myRequests
        });
    } catch (error) {
        console.error("Profile error:", error);
        res.json({ success: false, message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const updates = req.body;
        
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        if (updates.becomeDonor || updates.isDonor) {
            const donorAge = updates.age || user.age;
            const donorWeight = updates.weight || user.weight;
            
            if (!donorAge || donorAge < 18 || donorAge > 65) {
                return res.json({ success: false, message: "Age must be between 18 and 65 to become a donor" });
            }
            if (!donorWeight || donorWeight < 50) {
                return res.json({ success: false, message: "Minimum weight 50 kg required to become a donor" });
            }
            
            user.isDonor = true;
            user.donorInfo = {
                ...user.donorInfo,
                available: true,
                medicalConditions: updates.medicalConditions || '',
                description: updates.description || '',
                verified: false
            };
        }
        
        if (updates.name) user.name = updates.name;
        if (updates.phone) user.phone = updates.phone;
        if (updates.bloodGroup) user.bloodGroup = updates.bloodGroup;
        if (updates.age) user.age = Number(updates.age);
        if (updates.weight) user.weight = Number(updates.weight);
        
        if (updates.address) {
            user.address = { ...user.address, ...updates.address };
        }
        if (updates.city) {
            user.address.city = updates.city;
        }
        
        if (user.isDonor) {
            if (updates.available !== undefined) {
                user.donorInfo.available = updates.available;
            }
        }
        
        await user.save();
        
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.json({ 
            success: true, 
            message: "Profile updated successfully", 
            user: userResponse 
        });
        
    } catch (error) {
        console.error("Update error:", error);
        res.json({ success: false, message: error.message });
    }
};



export const getAllDonors = async (req, res) => {
    try {
        const { bloodGroup, city, available, urgent, search, excludeUserId } = req.query;
        
        let filter = { isDonor: true };
        
        if (excludeUserId) {
            filter._id = { $ne: excludeUserId };
        }
        
        if (bloodGroup) {
            const groups = bloodGroup.split(',');
            filter.bloodGroup = { $in: groups };
        }
        if (city) {
            const cities = city.split(',');
            filter['address.city'] = { $in: cities };
        }
        if (available === 'true') filter['donorInfo.available'] = true;
        if (urgent === 'true') filter['donorInfo.urgent'] = true;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { 'address.city': { $regex: search, $options: 'i' } }
            ];
        }
        
        const donors = await userModel.find(filter)
            .select('-password')
            .sort({ 'donorInfo.urgent': -1, 'donorInfo.featured': -1, createdAt: -1 });
        
        res.json({ success: true, donors, total: donors.length });
    } catch (error) {
        console.error("Get donors error:", error);
        res.json({ success: false, message: error.message });
    }
};
export const getSingleDonor = async (req, res) => {
    try {
        const { id } = req.body;
        const donor = await userModel.findById(id).select('-password');
        
        if (!donor || !donor.isDonor) {
            return res.json({ success: false, message: "Donor not found" });
        }
        
        res.json({ success: true, donor });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const toggleDonorAvailability = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        
        if (!user || !user.isDonor) {
            return res.json({ success: false, message: "You are not registered as a donor" });
        }
        
        user.donorInfo.available = !user.donorInfo.available;
        await user.save();
        
        res.json({ 
            success: true, 
            message: `You are now ${user.donorInfo.available ? 'available' : 'unavailable'} for donation`,
            available: user.donorInfo.available
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getUrgentDonors = async (req, res) => {
    try {
        const donors = await userModel.find({
            isDonor: true,
            'donorInfo.urgent': true,
            'donorInfo.available': true
        }).select('-password').limit(10);
        
        res.json({ success: true, donors });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_S);
            res.json({ success: true, token, message: "Admin login successful" });
        } else {
            res.json({ success: false, message: "Invalid admin credentials" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getDonationHistory = async (req, res) => {
    try {
        const donorId = req.userId;
        
        const donor = await userModel.findById(donorId).select('-password');
        if (!donor || !donor.isDonor) {
            return res.json({ success: false, message: "Not a registered donor" });
        }

        const donationHistory = await requestModel.find({
            'requests.donorId': donorId,
            status: 'fulfilled'
        }).sort({ fulfilledDate: -1 });

        const lastDonation = donationHistory[0];
        let nextEligibleDate = null;
        let daysUntilEligible = null;

        if (lastDonation && lastDonation.fulfilledDate) {
            const lastDate = new Date(lastDonation.fulfilledDate);
            nextEligibleDate = new Date(lastDate);
            nextEligibleDate.setDate(lastDate.getDate() + 90);
            
            const today = new Date();
            const diffTime = nextEligibleDate - today;
            daysUntilEligible = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        let totalUnitsDonated = 0;
        donationHistory.forEach(request => {
            const donorEntry = request.requests.find(r => r.donorId.toString() === donorId);
            if (donorEntry) {
                totalUnitsDonated += donorEntry.units || 1;
            }
        });

        res.json({
            success: true,
            donationHistory: donationHistory.map(request => ({
                requestId: request._id,
                requestNumber: request.requestNumber,
                patientName: request.patientInfo?.name,
                hospital: request.patientInfo?.hospital,
                bloodGroup: request.patientInfo?.bloodGroup,
                units: request.requests.find(r => r.donorId.toString() === donorId)?.units || 1,
                fulfilledDate: request.fulfilledDate,
                urgency: request.urgency
            })),
            stats: {
                totalDonations: donationHistory.length,
                totalUnitsDonated,
                lastDonationDate: donationHistory[0]?.fulfilledDate || null,
                nextEligibleDate,
                daysUntilEligible: daysUntilEligible < 0 ? 0 : daysUntilEligible,
                isEligible: daysUntilEligible <= 0
            }
        });
    } catch (error) {
        console.error("Donation history error:", error);
        res.json({ success: false, message: error.message });
    }
};