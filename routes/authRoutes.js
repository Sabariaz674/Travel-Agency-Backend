const express = require('express');
const router = express.Router();

// Import controllers
const { signup } = require('../controllers/manualController');
const { login } = require('../controllers/loginController');
const { googleLogin } = require('../controllers/googleController'); // Import your Google login controller

// Import validation middlewares
const { validateSignup, validateLogin } = require('../middlewares/validationMiddleware');

// Route for manual signup with validation middleware
router.post('/signup', validateSignup, signup);

// Route for manual login with validation middleware
router.post('/login', validateLogin, login);

// Add the route for Google login
router.get('/google', googleLogin);

module.exports = router;