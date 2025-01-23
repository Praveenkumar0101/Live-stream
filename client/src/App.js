// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./App.css"; // Add your CSS styles here

// function App() {
//   const [videos, setVideos] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [theme, setTheme] = useState("dark");

//   // Fetch videos from the backend
//   const fetchVideos = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/uploads/videos");
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
//       const response = await axios.post(
//         `http://localhost:5000/api/videos/${videoId}/rating`, // Ensure this matches the backend route
//         { rating }
//       );
//       fetchVideos(); // Re-fetch the videos to update their ratings
//     } catch (err) {
//       console.error("Error updating rating:", err.message);
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
//             {theme === "light" ? (
//               <i className="fas fa-moon"></i> // Moon icon for light theme
//             ) : (
//               <i className="fas fa-sun"></i> // Sun icon for dark theme
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Display Videos in Grid */}
//       <div className="video-grid">
//         {filteredVideos.map((video) => (
//           <div key={video._id} className="video-item">
//             <video src={video.url} controls className="video" />
//             <h3 className="video-title">{video.title}</h3>
//             <p className="video-description">{video.description || "No description available"}</p>

//             {/* Rating System */}
//             <div className="rating">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <i
//                   key={star}
//                   className={`fas fa-star ${star <= (video.userRating || 0) ? "rated" : ""}`}
//                   onClick={() => handleRatingChange(video._id, star)} // Update rating when clicked
//                 ></i>
//               ))}
//             </div>
//             {/* Display the user's rating */}
//             <p>Your Rating: {video.userRating || "Not Rated"}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;



import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Add your CSS styles here

function App() {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("dark");

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
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
