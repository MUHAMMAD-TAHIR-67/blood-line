// middleware/auth.js
import jwt from "jsonwebtoken";

export const authuser = async (req, res, next) => {
  const { token } = req.headers;
  
  if (!token) {
    return res.json({ success: false, message: "Token not available" });
  }
  
  try {
    const decode = jwt.verify(token, process.env.JWT_S);
    req.userId = decode.id; // Fixed: attach to req, not req.body
    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};