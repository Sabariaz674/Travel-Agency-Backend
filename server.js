// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { validateSignup, validateLogin } = require('./middlewares/validationMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const cookieParser = require('cookie-parser');
const path = require('path'); // Import the path module

const app = express();
dotenv.config();

// Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// CORS configuration: Allow requests from your frontend (React)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve static files from the 'uploads' directory
// This is crucial for displaying the uploaded logo images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to DB
connectDB();


app.use('/auth', authRoutes);
app.use('/api/flights', flightRoutes);


app.use(errorMiddleware);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
