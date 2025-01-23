const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  url: String,
  Description: String,
  rating: { type: Number, default: 0 }, 
});

module.exports = mongoose.model('Video', videoSchema);
