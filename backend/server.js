const express = require('express');
const colors = require('colors');
const cors = require('cors');
const multer = require('multer');

const dotenv = require('dotenv').config({ path: './.env' });
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
connectDB();
const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Multer middleware for handling form-data
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // set the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); // use the original file name
  },
});
const upload = multer({ storage: storage });
app.use(upload.single('image'));
app.use('/uploads', express.static('uploads')); // Serve the uploaded images
app.use('/terrains', require('./routes/terrainRoutes'));
app.use('/reservation', require('./routes/reservationRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use(errorHandler);

app.listen(port, '192.168.1.21', () => console.log(`Server started on port ${port}`));
