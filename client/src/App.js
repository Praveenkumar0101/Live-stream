import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App  () {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/uploads/videos');
      setVideos(response.data);
    } catch (err) {
      console.error('Error fetching videos:', err.message);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

 
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);

    setLoading(true);

    try {
      const response = await axios.post('/api/uploads/upload-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message);
      fetchVideos();
    } catch (err) {
      console.error('Error uploading video:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle video deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      const response = await axios.delete(`/api/uploads/videos/${id}`);
      alert(response.data.message);
      fetchVideos(); // Refresh the video list
    } catch (err) {
      console.error('Error deleting video:', err.message);
    }
  };

  return (
    <div>
      <h1>Video Manager</h1>

      {/* Upload Video */}
      <form onSubmit={handleUpload} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>

      {/* Display Videos */}
      <h2>Uploaded Videos</h2>
      <ul>
        {videos.map((video) => (
          <li key={video._id} style={{ marginBottom: '10px' }}>
            <h3>{video.title}</h3>
            <h3>Description</h3>
            <video
              src={video.url}
              controls
              width="300"
              style={{ display: 'block', marginBottom: '10px' }}
            ></video>
            <button onClick={() => handleDelete(video._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
