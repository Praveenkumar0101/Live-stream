const multer = require('multer');
const path = require('path');

// Define allowed file types (image files)
const fileTypes = /jpeg|jpg|png|gif|webp/;

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define destination folder for the uploaded files
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Define filename as current timestamp with file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image files are allowed!'), false); // Reject the file
  }
};

// Multer configuration with file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB (optional)
});

module.exports = upload;
