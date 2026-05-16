
import pkg from 'cloudinary';
import { donorModel } from '../models/donorModel.js';


export const addDonor = async (req, res) => {
    try {
        const { 
            name, email, phone, bloodGroup, city, age, weight,
            available, urgent, featured, description, medicalConditions, verified 
        } = req.body;

        // Handle image uploads
        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imageURL = [];
        if (images.length > 0) {
            imageURL = await Promise.all(
                images.map(async (img) => {
                    const result = await cloudinary.uploader.upload(img.path, {
                        resource_type: "image",
                    });
                    return result.secure_url;
                })
            );
        }

        const donorData = {
            name,
            email,
            phone,
            bloodGroup,
            city,
            age: Number(age),
            weight: Number(weight),
            available: available === "true" ? true : false,
            urgent: urgent === "true" ? true : false,
            featured: featured === "true" ? true : false,
            description,
            medicalConditions,
            verified: verified === "true" ? true : false,
            image: imageURL,
            createdAt: Date.now()
        };

        const donor = new donorModel(donorData);
        await donor.save();
        res.json({ success: true, message: "Donor added successfully", donor });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const listDonors = async (req, res) => {
    try {
        const { bloodGroup, city, available, urgent, search } = req.query;
        let filter = {};

        if (bloodGroup) {
            const groups = bloodGroup.split(',');
            filter.bloodGroup = { $in: groups };
        }
        if (city) {
            const cities = city.split(',');
            filter.city = { $in: cities };
        }
        if (available === 'true') filter.available = true;
        if (urgent === 'true') filter.urgent = true;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            ];
        }

        const donors = await donorModel.find(filter).sort({ urgent: -1, featured: -1, createdAt: -1 });
        res.json({ success: true, donors });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const singleDonor = async (req, res) => {
    try {
        const { id } = req.body; 
        const donor = await donorModel.findById(id);
        if (!donor) {
            return res.json({ success: false, message: "Donor not found" });
        }
        res.json({ success: true, donor });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const updateDonor = async (req, res) => {
    try {
        const { id, ...updates } = req.body; 
        const donor = await donorModel.findByIdAndUpdate(id, updates, { new: true });
        if (!donor) {
            return res.json({ success: false, message: "Donor not found" });
        }
        res.json({ success: true, message: "Donor updated successfully", donor });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Remove donor
export const removeDonor = async (req, res) => {
    try {
        const { id } = req.body; 
        await donorModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Donor removed successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const toggleAvailability = async (req, res) => {
    try {
        const { id } = req.body; 
        const donor = await donorModel.findById(id);
        if (!donor) {
            return res.json({ success: false, message: "Donor not found" });
        }
        donor.available = !donor.available;
        await donor.save();
        res.json({ success: true, message: `Donor is now ${donor.available ? 'available' : 'unavailable'}`, donor });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getUrgentDonors = async (req, res) => {
    try {
        const donors = await donorModel.find({ urgent: true, available: true }).limit(10);
        res.json({ success: true, donors });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getDonorsByBloodGroup = async (req, res) => {
    try {
        const { bloodGroup } = req.body;
        const donors = await donorModel.find({ bloodGroup, available: true });
        res.json({ success: true, donors });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};