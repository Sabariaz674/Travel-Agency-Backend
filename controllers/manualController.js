// manualController.js
const UserModel = require('../models/userModel'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();  // Import dotenv to access environment variables

// Manual Signup Controller
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email is already registered
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Get the salt rounds from environment variable, default to 10 if not set
    const saltRounds = process.env.SALT_ROUNDS || 10;  // Default to 10 if the environment variable is not set

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, parseInt(saltRounds));  // Use the parsed value from .env

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      isVerified: false,  // Initially set the user as unverified
    });

    await newUser.save();

    // Response message after successful signup
    res.status(201).json({ message: '✅ User created successfully. Please check your email for verification.' });

  } catch (err) {
    console.error('Signup error:', err);
    // Handle any errors with a 500 status
    res.status(500).json({ message: 'Something went wrong during signup', error: err.message });
  }
};

module.exports = { signup };
