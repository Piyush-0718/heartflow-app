const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { sendOTP, verifyOTP } = require('../utils/otp');
const { validateEmail, validatePhone } = require('../utils/validation');

function ensureDbConnected(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database unavailable',
      details: process.env.NODE_ENV === 'development' ? 'MongoDB is not connected' : undefined,
    });
  }
  return next();
}

// Register - Step 1: Send OTP
router.post('/send-otp', ensureDbConnected, async (req, res) => {
  try {
    const { email } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const otpResult = await sendOTP(email);
    res.json({
      message: 'OTP sent successfully',
      devOtp: process.env.NODE_ENV === 'development' ? otpResult?.devOtp : undefined,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Register - Step 2: Verify OTP
router.post('/verify-otp', ensureDbConnected, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const isValid = await verifyOTP(email, otp);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    const verificationToken = jwt.sign(
      { email, type: 'email_otp_verified' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '10m' }
    );

    res.json({ message: 'OTP verified successfully', verified: true, verificationToken });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Register - Step 3: Create Account
router.post('/register', ensureDbConnected, async (req, res) => {
  try {
    const { name, email, phone, password, gender, dateOfBirth, verificationToken } = req.body;

    // Validation
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (!validatePhone(phone)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
    if (!verificationToken) {
      return res.status(400).json({ error: 'Email verification is required' });
    }

    let verifiedEmail;
    try {
      const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET || 'your-secret-key');
      if (decoded.type !== 'email_otp_verified') {
        return res.status(400).json({ error: 'Invalid verification token' });
      }
      verifiedEmail = decoded.email;
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
    if (verifiedEmail !== email) {
      return res.status(400).json({ error: 'Verification token does not match email' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    // Create user
    const user = new User({
      name,
      email,
      phone,
      password,
      gender,
      dateOfBirth,
      isEmailVerified: true,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Failed to create account',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      code: process.env.NODE_ENV === 'development' ? error.code : undefined,
    });
  }
});

// Login
router.post('/login', ensureDbConnected, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is suspended or banned
    if (user.status === 'suspended' || user.status === 'banned') {
      return res.status(403).json({
        error: 'Account suspended',
        reason: user.suspensionReason,
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last active
    user.lastActive = new Date();
    user.isOnline = true;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.isFullyVerified(),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    // Update user online status
    // This would require auth middleware to get userId
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;
