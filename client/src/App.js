import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Add your CSS styles here

function App() {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("dark");
  const [feedback, setFeedback] = useState(""); // State to store new feedback input
  const [userName, setUserName] = useState(""); // State to store user name
  const [currentVideoId, setCurrentVideoId] = useState(null); // Track the video for feedback

  // Fetch videos from the backend
  const fetchVideos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/uploads/videos"); // Ensure this endpoint matches your backend
      setVideos(response.data);
    } catch (err) {
      console.error("Error fetching videos:", err.message);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Handle star rating change
  const handleRatingChange = async (videoId, rating) => {
    try {
      await axios.post(`http://localhost:5000/api/uploads/videos/${videoId}/rating`, { rating });
      fetchVideos(); // Re-fetch videos to update ratings
    } catch (err) {
      console.error("Error updating rating:", err.message);
    }
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async () => {
    if (!feedback || !userName) {
      alert("Please enter both your name and feedback.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/uploads/videos/${currentVideoId}/feedback`, {
        user: userName, // Send user name along with feedback
        comment: feedback,
      });
      fetchVideos(); // Re-fetch videos to update feedback
      setFeedback(""); // Clear feedback input
      setUserName(""); // Clear user name input
      setCurrentVideoId(null); // Reset current video ID
    } catch (err) {
      console.error("Error submitting feedback:", err.message);
    }
  };

  // Filter videos based on search query
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

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

            {/* Rating System */}
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fas fa-star ${star <= video.rating ? "rated" : ""}`}
                  onClick={() => handleRatingChange(video._id, star)}
                  style={{ cursor: "pointer" }}
                ></i>
              ))}
            </div>

            {/* Display Feedback */}
            <div className="feedback-section">
              <h4>Feedback:</h4>
              {video.feedback && video.feedback.length > 0 ? (
                <ul>
                  {video.feedback.map((feedbackItem, index) => (
                    <li key={index}>
                      <strong>{feedbackItem.user}:</strong> {feedbackItem.comment}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No feedback yet.</p>
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
                <button onClick={handleFeedbackSubmit} className="submit-feedback-button">Submit Feedback</button>
                <button onClick={() => setCurrentVideoId(null)} className="cancel-feedback-button">Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;



// -
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./App.css"; // Add your CSS styles here

// function App() {
//   const [videos, setVideos] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [theme, setTheme] = useState("dark");
//   const [feedback, setFeedback] = useState(""); // State to store new feedback input
//   const [currentVideoId, setCurrentVideoId] = useState(null); // Track the video for feedback

//   // Fetch videos from the backend
//   const fetchVideos = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/uploads/videos"); // Ensure this endpoint matches your backend
//       setVideos(response.data);
//     } catch (err) {
//       console.error("Error fetching videos:", err.message);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   // Handle star rating change
//   const handleRatingChange = async (videoId, rating) => {
//     try {
//       await axios.post(`http://localhost:5000/api/uploads/videos/${videoId}/rating`, { rating });
//       fetchVideos(); // Re-fetch videos to update ratings
//     } catch (err) {
//       console.error("Error updating rating:", err.message);
//     }
//   };

//   // Handle feedback submission
//   const handleFeedbackSubmit = async () => {
//     if (!feedback) {
//       alert("Please enter some feedback.");
//       return;
//     }

//     try {
//       await axios.post(`http://localhost:5000/api/uploads/videos/${currentVideoId}/feedback`, {
//         user: "Anonymous", // You can replace this with a real user ID or name
//         comment: feedback,
//       });
//       fetchVideos(); // Re-fetch videos to update feedback
//       setFeedback(""); // Clear feedback input
//       setCurrentVideoId(null); // Reset current video ID
//     } catch (err) {
//       console.error("Error submitting feedback:", err.message);
//     }
//   };

//   // Filter videos based on search query
//   const filteredVideos = videos.filter((video) =>
//     video.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Toggle theme between light and dark
//   const toggleTheme = () => {
//     setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
//   };

//   return (
//     <div className={`video-manager ${theme}`}>
//       <div className="header">
//         <h1 className="video-manager-title">🎥 Explore Videos 🎨</h1>
//         <div className="controls">
//           <input
//             type="text"
//             placeholder="Search videos..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="search-input"
//           />
//           <button onClick={toggleTheme} className="theme-toggle-button">
//             {theme === "light" ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
//           </button>
//         </div>
//       </div>

//       {/* Display Videos in Grid */}
//       <div className="video-grid">
//         {filteredVideos.map((video) => (
//           <div key={video._id} className="video-item">
//             <video src={video.url} controls className="video" />
//             <h3 className="video-title">{video.title}</h3>
//             <p className="video-description">{video.Description || "No description available"}</p>

//             {/* Rating System */}
//             <div className="rating">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <i
//                   key={star}
//                   className={`fas fa-star ${star <= video.rating ? "rated" : ""}`}
//                   onClick={() => handleRatingChange(video._id, star)}
//                   style={{ cursor: "pointer" }}
//                 ></i>
//               ))}
//             </div>

//             {/* Display Feedback */}
//             <div className="feedback-section">
//               <h4>Feedback:</h4>
//               {video.feedback && video.feedback.length > 0 ? (
//                 <ul>
//                   {video.feedback.map((feedbackItem, index) => (
//                     <li key={index}>
//                       <strong>{feedbackItem.user}:</strong> {feedbackItem.comment}
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No feedback yet.</p>
//               )}

//               {/* Add Feedback Button */}
//               <button
//                 onClick={() => setCurrentVideoId(video._id)}
//                 className="add-feedback-button"
//               >
//                 Add Feedback
//               </button>
//             </div>

//             {/* Feedback Input Popup */}
//             {currentVideoId === video._id && (
//               <div className="feedback-popup">
//                 <textarea
//                   placeholder="Enter your feedback"
//                   value={feedback}
//                   onChange={(e) => setFeedback(e.target.value)}
//                 ></textarea>
//                 <button onClick={handleFeedbackSubmit} className="submit-feedback-button">Submit Feedback</button>
//                 <button onClick={() => setCurrentVideoId(null)} className="cancel-feedback-button">Cancel</button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;
