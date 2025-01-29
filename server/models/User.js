const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  image: {
    type: String,
    default: 'default-profile-image.jpg',
  },
  bio: {
    type: String,
    default: '',
  },
});

const UserProfile = mongoose.model('UserProfile', userSchema);

module.exports = UserProfile;
