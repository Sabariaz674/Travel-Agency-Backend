const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Use the DB_URL from your .env file (you can change it back to MONGO_URI if preferred)
    const conn = await mongoose.connect(process.env.DB_URL || process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the application if connection fails
  }
};

// Export the connectDB function
module.exports = connectDB;
