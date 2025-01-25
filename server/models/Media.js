// const mongoose = require('mongoose');

// const mediaSchema = new mongoose.Schema({
//   title: String,
//   url: String,
//   description: String,
//   rating: { type: Number, default: 0 }, // Single rating field for simplicity
//   averageRating: { type: Number, default: 0 }, // Average rating
//   numberOfRatings: { type: Number, default: 0 }, // Track the number of ratings
// });

// module.exports = mongoose.model('Media', mediaSchema);



const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  averageRating: { type: Number, default: 0 },
  numberOfRatings: { type: Number, default: 0 },
  // rating given by the current user
  feedback: [{ 
    user: { type: String, required: true }, // user's name or ID
    comment: { type: String, required: true }, 
    userRating: { type: Number, default: 0 },// feedback comment
  }],
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
