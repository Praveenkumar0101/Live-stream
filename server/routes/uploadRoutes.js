

const express = require('express');
const cloudinary = require('../config/cloudinary'); // Import Cloudinary config
const multer = require('../config/Multer'); // Import Multer config
const Media = require('../models/Media'); // Import the Media model

const router = express.Router();

// Video upload endpoint
router.post('/upload-video', multer.single('video'), async (req, res) => {
console.log(req.file,'bbbbbbbbb');

  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check if the description is provided
    if (!req.body.description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    // Upload the video to Cloudinary
    const result = await new Promise((resolve, reject) => {
  
      
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video', // Specify video resource
          folder: 'videos', // Save to a folder in Cloudinary
        },
        (error, response) => {
          if (error) return reject(error);
          resolve(response);
        }
      );
      stream.end(req.file.buffer);
    });
console.log(result,'rdrdrdrdr');

    // Save video details to MongoDB
    const media = new Media({
      title: req.body.title || 'Untitled Video', // Default title if none is provided
      url: result.secure_url,
      description: req.body.description, // Ensure description is provided
    });

    await media.save();

    // Respond with success
    res.status(201).json({
      message: 'Video uploaded successfully',
      media,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading video', error: err.message });
  }
});

// Rate a video endpoint
router.post('/videos/:videoId/rating', async (req, res) => {
  console.log('rating')
  try {
    const { videoId } = req.params; // Video ID from the URL
    const { userId, rating } = req.body; // User ID and rating from the request body

    if (!userId || !rating) {
      return res.status(400).json({ message: 'User ID and rating are required' });
    }

    const video = await Media.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if the user has already rated
    const existingRating = video.ratings.find((rate) => rate.userId === userId);

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = rating;
    } else {
      // Add a new rating
      video.ratings.push({ userId, rating });
    }

    // Recalculate the average rating
    const totalRatings = video.ratings.reduce((sum, rate) => sum + rate.rating, 0);
    video.numberOfRatings = video.ratings.length;
    video.averageRating = totalRatings / 5;

    await video.save();

    res.status(200).json({
      message: 'Rating updated successfully',
      averageRating: video.averageRating,
      // numberOfRatings: video.numberOfRatings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating rating', error: err.message });
  }
});



// Submit feedback for a video
router.post('/videos/:videoId/feedback', async (req, res) => {
  console.log(req.body);
  
  try {
    const { videoId } = req.params;
    const { user, comment, userRating } = req.body;

    // Validate that user and comment are provided
    if (!user || !comment) {
      return res.status(400).json({ message: 'User and comment are required' });
    }

    // Validate rating to be between 1 and 5 (if rating exists)
    if (userRating && (userRating < 1 || userRating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Find the video by ID
    const video = await Media.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if the user has already submitted feedback
    const existingFeedback = video.feedback.find((fb) => fb.user === user);
    if (existingFeedback) {
      return res.status(400).json({ message: 'User has already submitted feedback for this video' });
    }

    // Prepare the feedback object
    const feedback = {
      user,
      comment,
      userRating: userRating || 0, 
      date: new Date(),
    };

    let count = 0
    // Add feedback to the video and save
    video.feedback.push(feedback);
   
    const data = await video.save();
    console.log(data,'vididididi')
    // Respond with the updated feedback array
    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: video.feedback,  // Return the updated feedback array
    });
  } catch (err) {
    console.error('Error submitting feedback:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



router.get('/videos/:videoId/feedback', async (req, res) => {
  try {
    const { videoId } = req.params;

    // Find the video by ID
    const video = await Media.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Respond with feedback and ratings for the video
    res.status(200).json({message:video});
  } catch (err) {
    console.error('Error fetching feedback:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Utility function to calculate the average rating
// const calculateAverageRating = (feedbackArray) => {
//   if (feedbackArray.length === 0) return 0;

//   const totalRating = feedbackArray.reduce((sum, feedback) => sum + (feedback.userRating || 0), 0);
//   return (totalRating / 5)// Return the average rating rounded to 1 decimal place
// };


// Get all videos endpoint
router.get('/videos', async (req, res) => {
  try {
    const videos = await Media.find();
    res.status(200).json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching videos', error: err.message });
  }
});


router.get('/videos/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    const video = await Media.findById(videoId).populate('feedback.user');
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.status(200).json(video);  // Return the video along with feedback data
  } catch (err) {
    console.error('Error fetching video:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


module.exports = router;
