const express = require('express');
const app = express();
const helmet = require('helmet');
require('dotenv').config();

const userRoutes = require('./routes/User');
const profileRoutes = require('./routes/Profile');
const courseRoutes = require('./routes/Courses');
const paymentRoutes = require('./routes/Payment');

const database = require('./config/database');
const { cloudinaryConnect } = require('./config/cloudinary');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow serving images

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(cookieParser());

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  abortOnLimit: true,
}));

// Routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/payment', paymentRoutes);

// 404 Handler
app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Start Server
async function startServer() {
  try {
    await database.connect();
    await cloudinaryConnect();
    if (process.env.NODE_ENV !== 'test') {
      app.listen(5000, () => console.log('Server is running on port 5000'));
    }
  } catch (err) {
    console.error('Startup failure:', err);
    process.exit(1);
  }
}

startServer();


module.exports = app; // Export the app for testing purposes