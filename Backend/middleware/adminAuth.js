// middleware/adminAuth.js
import jwt from "jsonwebtoken";

export const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ success: false, message: "Token is not available" });
    }

    const decoded = jwt.verify(token, process.env.JWT_S);

    // Fixed: Check if decoded token has admin role
    if (decoded.role !== 'admin') {
      return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }

    req.adminEmail = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};