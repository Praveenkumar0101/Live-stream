const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
const Registration = require('./routes/Registration-login')
const userRoutes = require ('./routes/User')

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/uploads', uploadRoutes);
app.use('/Registration', Registration);
app.use('/user', userRoutes);

// Default route
// app.get('/', (req, res) => {
//   res.send('Welcome to the Cloudinary Upload API');
// });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
