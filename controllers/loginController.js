const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Manual Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin exists, otherwise create an admin account
    const existingAdmin = await UserModel.findOne({ email: 'admin@yourapp.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const newAdmin = new UserModel({
        email: 'admin@yourapp.com',
        username: 'Admin User',
        password: hashedPassword,
        isAdmin: true,
      });
      await newAdmin.save();
      console.log('Admin account created successfully!');
    }

    // Find the user in the database
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: '❌ User not found' });
    }

    // Check if user has logged in with Google (check googleId field)
    if (user.googleId) {
      // User exists and is linked with Google, log them in
      const token = jwt.sign(
        { email: user.email, id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return res.status(200).json({
        message: 'Login successful',
        user: {
          email: user.email,
          username: user.username,
          isAdmin: user.isAdmin,
          
        },
       token:token,
      });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '❌ Invalid credentials' });
    }

    // Generate JWT token for manual login
    const token = jwt.sign(
      { email: user.email, id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // You can set the expiry time as per your needs (7d here)
    );

    // Set the token in an HttpOnly cookie
    res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',  // Ensure it's set to false if in dev mode and not using HTTPS
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,  // Cookie expiration time (7 days)
});




    // Send the response with user data (excluding the token as it is in the cookie)
    res.status(200).json({
      message: 'Login successful',
      user: {
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: '❌ Something went wrong during login', error: err.message });
  }
};

module.exports = { login };
