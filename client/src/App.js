import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Add your CSS styles here

function App() {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("dark");
  const [feedback, setFeedback] = useState(""); // State to store feedback input
  const [userName, setUserName] = useState(""); // State to store user name
  const [currentVideoId, setCurrentVideoId] = useState(null); // Track the video for feedback
  const [userRatings, setUserRatings] = useState({}); // State to track individual user ratings
  const [feedbackRating, setFeedbackRating] = useState(0); // State to store feedback rating
  const [dropdownStates, setDropdownStates] = useState({}); // State to track dropdown visibility for each video

  console.log(videos, 'all videos')
  // console.log(currentVideoId, 'iiiii');

  // Fetch videos from the backend
  const fetchVideos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/uploads/videos");
      setVideos(response.data);
    } catch (err) {
      console.error("Error fetching videos:", err.message);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Handle star rating change for video rating
  const handleRatingChange = async (videoId, rating) => {
    console.log('iiiiii',videoId);
    
    if (!userName) {
      alert("Please enter your name before rating.");
      return;
    }

    try {
      // Update rating through the API
      const response = await axios.post(`http://localhost:5000/api/uploads/videos/${videoId}/rating`, {
        user: userName,
        rating,
      });

      // Update user rating for this video
      setUserRatings((prev) => ({ ...prev, [videoId]: rating }));

      // Update the video rating in the state
      const updatedVideos = videos.map((video) =>
        video._id === videoId ? { ...video, userRating: rating } : video
      );
      setVideos(updatedVideos); // Update video list to reflect new rating

    } catch (err) {
      console.error("Error updating rating:", err.message);
    }
  };

  


  // Handle star rating change for feedback submission
  const handleFeedbackRatingChange = (rating) => {
    setFeedbackRating(rating);
  };

  // Feedback submission
  const handleFeedbackSubmit = async () => {
    console.log('hhhhhhhhhh');
    
    if (!feedback || !userName) {
      alert("Please enter both your name and feedback.");
      return;
    }

    try {
      const hello = await axios.post(`http://localhost:5000/api/uploads/videos/${currentVideoId}/feedback`, {
        user: userName,  // Use 'user' instead of 'userId'
        comment: feedback,
        userRating: feedbackRating, // Include the user's rating in feedback
      });

      console.log(hello, ' hello');

      // Update the feedback for this video in the state
      const updatedVideos = videos.map((video) =>
        video._id === currentVideoId ? {
          ...video,
          feedback: [...video.feedback, { user: userName, comment: feedback, userRating: feedbackRating }]
        } : video
      );
      setVideos(updatedVideos); // Update the video list with new feedback

      setFeedback(""); // Clear feedback input
      setUserName(""); // Clear user name input
      setFeedbackRating(0); // Clear feedback rating
      setCurrentVideoId(null); // Reset current video ID
    } catch (err) {
      console.error("Error submitting feedback:", err.message);
    }
  };

  const toggleDropdown = (videoId) => {
    setDropdownStates((prevStates) => ({
      ...prevStates,
      [videoId]: !prevStates[videoId],
    }));
  };

  // Filter videos based on search query
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

 let count = 0;
console.log(count,'count');

  return (
    <div className={`video-manager ${theme}`}>
      <div className="header">
        <h1 className="video-manager-title">🎥 Explore Videos 🎨</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={toggleTheme} className="theme-toggle-button">
            {theme === "light" ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
          </button>
        </div>
      </div>

      {/* Display Videos in Grid */}
      <div className="video-grid">
        {filteredVideos.map((video) => (
          <div key={video._id} className="video-item">
            <video src={video.url} controls className="video" />
            <h3 className="video-title">{video.title}</h3>
            <p className="video-description">{video.Description || "No description available"}</p>


<div className="rating">
  {/* Calculate the average rating */}
  <span>
    Average Rating:{" "}
    {video.feedback.length > 0
      ? (video.feedback.reduce((total, ele) => total + ele.userRating, 0) / video.feedback.length).toFixed(1)
      : 0}{" "}

  </span>

  {/* Display stars based on average rating */}
  <div>
    {(() => {
      const averageRating =
        video.feedback.length > 0
          ? video.feedback.reduce((total, ele) => total + ele.userRating, 0) /
            video.feedback.length
          : 0;

      // Generate stars with filled, half-filled, or empty states
      return [1, 2, 3, 4, 5].map((star) => {
        if (star <= averageRating) {
          // Fully filled star
          return <i key={star} className="fas fa-star rated" style={{ color: "gold" }}></i>;
        } else if (star - averageRating < 1 && star - averageRating > 0) {
          // Half-filled star
          return <i key={star} className="fas fa-star-half-alt rated" style={{ color: "gold" }}></i>;
        } else {
          // Empty star
          return <i key={star} className="far fa-star" style={{ color: "gray" }}></i>;
        }
      });
    })()}
  </div>
</div>



            {/* Display Feedback */}

            <div className="feedback-section">

            <h4
  onClick={() => toggleDropdown(video._id)}
  className="review-feedback-toggle"
  title="Click to view all user ratings and feedback"
>
  Review feedback {dropdownStates[video._id] ? "▲" : "▼"}
</h4>


              {dropdownStates[video._id] && (
                <div>
                  {video.feedback && video.feedback.length > 0 ? (
                    <ul>
                      {video.feedback.map((feedbackItem, index) => (
                        <li key={index} className="feedback-item">
                          <strong>{feedbackItem.user}:</strong> {feedbackItem.comment}
                          <div className="user-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <i
                                key={star}
                                className={`fas fa-star ${star <= feedbackItem.userRating
                                  ? "rated" : ""}`}
                              ></i>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No feedback yet.</p>
                  )}
                </div>
              )}

              {/* Add Feedback Button */}
              <button
                onClick={() => setCurrentVideoId(video._id)}
                className="add-feedback-button"
              >
                Add Feedback
              </button>
            </div>

            {/* Feedback Input Popup */}
            {currentVideoId === video._id && (
              <div className="feedback-popup">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="user-name-input"
                />
                <textarea
                  placeholder="Enter your feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                ></textarea>

                {/* Star Rating for Feedback */}
                <div className="rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fas fa-star ${star <= feedbackRating ? "rated" : ""}`}
                      onClick={() => handleFeedbackRatingChange(star)}
                      style={{ cursor: "pointer" }}
                    ></i>
                  ))}
                </div>

                <button onClick={handleFeedbackSubmit} className="submit-feedback-button">
                  Submit Feedback
                </button>
                <button onClick={() => setCurrentVideoId(null)} className="cancel-feedback-button">
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

