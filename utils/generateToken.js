const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TIMEOUT = process.env.JWT_TIMEOUT || '1h';  // Default expiration time if not provided in .env

// Function to generate JWT token
const generateToken = (userId, userEmail, userRole) => {
  return jwt.sign(
    { _id: userId, email: userEmail, role: userRole },  // Payload (user data)
    JWT_SECRET,  // Secret key from environment variables
    { expiresIn: JWT_TIMEOUT }  // Token expiration time
  );
};

module.exports = generateToken;
