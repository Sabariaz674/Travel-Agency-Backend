const { oauth2client } = require("../utils/googleConfig");
const axios = require('axios');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;  // Google OAuth code from the frontend
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    console.log('Google user info:', userRes.data);
    const { email, name, picture, id } = userRes.data;

    let user = await UserModel.findOne({ email });

    if (!user) {
      // If the user doesn't exist, create a new account
      user = await UserModel.create({
        name,
        email,
        image: picture,
        googleId: id,  // Store Google ID to link this login method
        role: 'user',
      });
    } else {
      // If the user exists, check if they have linked their Google account
      if (!user.googleId) {
        // Link the Google account to the user's profile
        user.googleId = id;
        user.image = picture;  // Optionally update profile picture
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set the token in HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true, // Prevent JavaScript access to the cookie (security)
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
      sameSite: 'Strict', // Helps protect against CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiry (7 days)
    });

    // Send response with user data (excluding token, which is stored in the cookie)
    return res.status(200).json({
      message: 'Google login successful',
      user: {
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Google login error:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
};

module.exports = { googleLogin };
