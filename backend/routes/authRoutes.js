const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role, collegeName } = req.body;

  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({ message: 'Please include all required fields' });
  }

  // Check user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create user
  try {
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role
    };

    if (role === 'student') {
      if (!collegeName) {
        return res.status(400).json({ message: 'College name is required for students' });
      }
      userData.collegeName = collegeName;
    }

    const user = await User.create(userData);

    if (user) {
      // Log user in immediately after registration
      req.login(user, function(err) {
        if (err) { return res.status(500).json({ message: err.message }); }
        return res.status(201).json({
          _id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin,
          message: 'User registered and logged in'
        });
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      return res.json({
        _id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        message: 'Logged in successfully'
      });
    });
  })(req, res, next);
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.json({ message: 'Logged out successfully' });
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      _id: req.user.id,
      name: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      role: req.user.role,
      isAdmin: req.user.isAdmin
    });
  } else {
    res.status(401).json({ message: 'Not authorized' });
  }
});

module.exports = router;
