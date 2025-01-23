// const express = require('express');
// const cloudinary = require('../config/cloudinary'); // Import Cloudinary config
// const multer = require('../config/Multer'); // Import Multer config
// const Media = require('../models/Media'); // Import the Media model

// const router = express.Router();

// // Video upload endpoint

// router.post('/upload-video', multer.single('video'), async (req, res) => {
//   try {
//     // Check if a file was uploaded
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     // Check if the description is provided
//     if (!req.body.description) {
//       return res.status(400).json({ message: 'Description is required' });
//     }

//     // Upload the video to Cloudinary
//     const result = await new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         {
//           resource_type: 'video', // Specify video resource
//           folder: 'videos', // Save to a folder in Cloudinary
//         },
//         (error, response) => {
//           if (error) return reject(error);
//           resolve(response);
//         }
//       );
//       stream.end(req.file.buffer);
//     });

//     // Save video details to MongoDB
//     const media = new Media({
//       title: req.body.title || 'Untitled Video', // Default title if none is provided
//       url: result.secure_url,
//       description: req.body.description, // Ensure description is provided
//     });

//     await media.save();

//     // Respond with success
//     res.status(201).json({
//       message: 'Video uploaded successfully',
//       media,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error uploading video', error: err.message });
//   }
// });






// // Rate a video endpoint
// router.post('/videos/:videoId/rating', async (req, res) => {
//   try {
//     const { videoId } = req.params;  // Video ID from the URL
//     const { rating } = req.body;    // Rating from the request body

//     const video = await Media.findById(videoId);
//     if (!video) {
//       return res.status(404).json({ message: 'Video not found' });
//     }

//     // Update the video rating field
//     video.userRating = rating;
//     await video.save();

//     res.status(200).json({ message: 'Rating updated successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error updating rating', error: err.message });
//   }
// });





// // Get all videos endpoint
// router.get('/videos', async (req, res) => {
//   try {
//     const videos = await Media.find();
//     res.status(200).json(videos);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error fetching videos', error: err.message });
//   }
// });

// // Update video endpoint
// router.put('/videos/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title } = req.body;

//     const video = await Media.findByIdAndUpdate(
//       id,
//       { title },
//       { new: true, runValidators: true }
//     );

//     if (!video) {
//       return res.status(404).json({ message: 'Video not found' });
//     }

//     res.status(200).json({
//       message: 'Video updated successfully',
//       video,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error updating video', error: err.message });
//   }
// });

// // Delete video endpoint
// router.delete('/videos/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     const video = await Media.findByIdAndDelete(id);

//     if (!video) {
//       return res.status(404).json({ message: 'Video not found' });
//     }

//     // Delete the video from Cloudinary
//     await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });

//     res.status(200).json({
//       message: 'Video deleted successfully',
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error deleting video', error: err.message });
//   }
// });

// module.exports = router;


const express = require('express');
const cloudinary = require('../config/cloudinary'); // Import Cloudinary config
const multer = require('../config/Multer'); // Import Multer config
const Media = require('../models/Media'); // Import the Media model

const router = express.Router();

// Video upload endpoint
router.post('/upload-video', multer.single('video'), async (req, res) => {
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
  try {
    const { videoId } = req.params;  // Video ID from the URL
    const { rating } = req.body;    // Rating from the request body

    const video = await Media.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update the video rating
    video.numberOfRatings += 1;
    video.averageRating = (video.averageRating * (video.numberOfRatings - 1) + rating) / video.numberOfRatings;
    video.userRating = rating; // Store the rating for the current user

    await video.save();

    res.status(200).json({ message: 'Rating updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating rating', error: err.message });
  }
});

// Submit feedback for a video
router.post('/videos/:videoId/feedback', async (req, res) => {
  try {
    const { videoId } = req.params;   // Extract the videoId from the URL
    const { user, comment } = req.body;  // Extract user and comment from the request body

    // Validate if the video exists in the database
    const video = await Media.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Create new feedback object
    const feedback = {
      user,
      comment
    };

    // Push feedback to the video's feedback array
    video.feedback.push(feedback);

    // Save the updated video document
    await video.save();

    // Respond with success message
    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: video.feedback,  // Optionally, return the updated feedback array
    });
  } catch (err) {
    console.error('Error submitting feedback:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



// Get video details including ratings and feedback
router.get('/videos/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Media.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Return the video data along with ratings and feedback
    res.status(200).json({
      title: video.title,
      url: video.url,
      description: video.description,
      averageRating: video.averageRating,
      numberOfRatings: video.numberOfRatings,
      feedback: video.feedback,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching video data', error: err.message });
  }
});

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

module.exports = router;
