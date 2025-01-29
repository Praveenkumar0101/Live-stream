import React, { useState } from 'react';
import './User.css';

function Profile() {
  const [userProfile, setUserProfile] = useState({
    image: '', // default image or user image URL
    bio: '', // default bio or user bio
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // State to track if settings modal is open
  const [selectedImage, setSelectedImage] = useState(null); // State for the image file selected by the user

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Set the image preview
      setUserProfile({ ...userProfile, image: URL.createObjectURL(file) });
      setSelectedImage(file); // Save the file to send in the form
    }
  };

  // Handle save profile changes
  const handleSaveProfile = () => {
    if (!selectedImage) {
      alert('Please select an image before saving.');
      return;
    }

    // Prepare the form data
    const formData = new FormData();
    formData.append('image', selectedImage); // Attach image file
    formData.append('bio', userProfile.bio); // Attach bio

    // Send the profile update request to the server
    fetch('http://localhost:5000/user/profile', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Profile Saved:', data);
        setIsSettingsOpen(false); // Close the modal after saving
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="profile">
      {/* Profile Section */}
      <div className="profile-section">
        <img
          src={userProfile.image || 'default-profile-image.jpg'} // Default image if no profile image
          alt="User Profile"
          className="profile-image"
          onClick={() => setIsSettingsOpen(true)} // Open settings when image is clicked
        />
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="settings-modal">
          <div className="modal-content">
            <h3>Edit Profile</h3>
            <div className="modal-body">
              {/* Image Input */}
              <div className="image-upload">
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <img
                  src={userProfile.image || 'default-profile-image.jpg'}
                  alt="Profile Preview"
                  className="image-preview"
                />
              </div>

              {/* Bio Input */}
              <textarea
                placeholder="Enter your bio..."
                value={userProfile.bio}
                onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
              ></textarea>
            </div>

            <div className="modal-footer">
              <button onClick={handleSaveProfile}>Save</button>
              <button onClick={() => setIsSettingsOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
