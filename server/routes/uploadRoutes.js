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
      rating: 0, // Default rating
      averageRating: 0, // Default average rating
      numberOfRatings: 0, // Default number of ratings
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

    // Add the new rating (if it's a valid rating)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Update the video rating
    video.rating = rating;

    // Update the average rating and the number of ratings
    video.numberOfRatings += 1;
    video.averageRating = ((video.averageRating * (video.numberOfRatings - 1)) + rating) / video.numberOfRatings;

    await video.save();

    res.status(200).json({ message: 'Rating updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating rating', error: err.message });
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

// Update video endpoint
router.put('/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const video = await Media.findByIdAndUpdate(
      id,
      { title },
      { new: true, runValidators: true }
    );

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.status(200).json({
      message: 'Video updated successfully',
      video,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating video', error: err.message });
  }
});

// Delete video endpoint
router.delete('/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Media.findByIdAndDelete(id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Delete the video from Cloudinary
    await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });

    res.status(200).json({
      message: 'Video deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting video', error: err.message });
  }
});

module.exports = router;

