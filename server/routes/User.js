// routes/user.js
const express = require('express');
const router = express.Router();
const upload = require('../config/Multer')
const User = require('../models/User');

router.post('/profile', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }
      const { bio } = req.body;
      const image = req.file ? req.file.filename : undefined;
  
      const user = await User.findOneAndUpdate(
        {},
        { image, bio },
        { new: true, upsert: true }
      );
  
      res.json(user);
    } catch (err) {
      console.error('Error updating profile:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;
