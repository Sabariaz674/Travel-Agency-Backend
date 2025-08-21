const { body, validationResult } = require('express-validator');

// Signup Validation Middleware
const validateSignup = [
  body('email').isEmail().withMessage('❌ Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('❌ Password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('❌ Passwords do not match'),
  
  // Validate and check the errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
];

// Login Validation Middleware
const validateLogin = [
  body('email').isEmail().withMessage('❌ Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('❌ Password is required'),
  
  // Validate and check the errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
];

module.exports = { validateSignup, validateLogin };
