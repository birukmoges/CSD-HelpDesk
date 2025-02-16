const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter (optional): Only accept certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and PDF files are allowed."));
  }
};

// Initialize multer with storage and file filter
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit files to 5MB
  fileFilter,
});

// Middleware to handle two separate fields
const uploadFields = upload.fields([
  { name: "uploadedImage", maxCount: 1 }, // Field for image uploads
  { name: "uploadedFile", maxCount: 1 },  // Field for file uploads
]);

module.exports = uploadFields;
