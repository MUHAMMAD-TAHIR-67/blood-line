
import jwt from "jsonwebtoken";

const user = async (req, res, next) => {
  const { token } = req.headers; 
  
  if (!token) {
    return res.json({ success: false, message: 'Token is unauthorized, login again' });
  }
  
  try {
    const tokendecode = jwt.verify(token, process.env.JWT_S);
    if (tokendecode) {
      req.userId = tokendecode.id;
    } else {
      return res.json({ success: false, message: "Not authorized, login again" });
    }
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default user;