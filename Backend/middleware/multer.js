import multer from "multer";

// Set storage config with destination and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists or create it
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Add timestamp to avoid name conflicts
  },
});

// Initialize multer
export const upload = multer({ storage });

