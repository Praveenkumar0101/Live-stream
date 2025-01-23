const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: String,
  url: String,
  description: String,
  rating: { type: Number, default: 0 }, // Single rating field for simplicity
  averageRating: { type: Number, default: 0 }, // Average rating
  numberOfRatings: { type: Number, default: 0 }, // Track the number of ratings
});

module.exports = mongoose.model('Media', mediaSchema);
