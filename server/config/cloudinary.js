require("dotenv").config()
const cloudinary = require("cloudinary").v2
// Set up Cloudinary with environment variables

console.log("Cloud_Name", process.env.CLOUDINARY_CLOUD_NAME);


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
