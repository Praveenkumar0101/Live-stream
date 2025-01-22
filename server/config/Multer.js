const multer = require('multer');

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit file size to 100MB
  fileFilter: (req, file, cb) => {
    // Accept only video files
    if (!file.mimetype.startsWith('video/')) {
      return cb(new Error('Only video files are allowed!'), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
