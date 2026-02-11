const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res, next) => {
  const { firstName, lastName, email, password, role, collegeName, firebaseUid, isVerified } = req.body;

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
      role,
      firebaseUid,
      isVerified: false // Force verify false initially
    };

    if (role === 'student') {
      if (!collegeName) {
        return res.status(400).json({ message: 'College name is required for students' });
      }
      userData.collegeName = collegeName;
    }

    // Generate numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    userData.otp = otp;
    userData.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const user = await User.create(userData);

    if (user) {
      // Send OTP via Email
      const message = `Your optimization One-Time Password (OTP) is ${otp}. It is valid for 10 minutes.`;
      
      try {
        await sendEmail({
          email: user.email,
          subject: 'UniXHub Verification Code',
          text: message,
          html: `<p>Your verification code is: <strong>${otp}</strong></p><p>It is valid for 10 minutes.</p>`
        });
      
        res.status(201).json({
          _id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          message: 'User registered. Please verify your email with the OTP sent.'
        });
      } catch (emailError) {
        console.error('Email send failed:', emailError);
        // Still return success but warn about email failure? Or fail?
        // Let's return success but with a flag so frontend knows.
        res.status(201).json({
           _id: user.id,
           message: 'User registered but email failed to send. Please try resending OTP.'
        });
      }

    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
router.post('/verify-otp', async (req, res, next) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ message: 'Provide email and OTP' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: 'User already verified' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // OTP Correct and Valid
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // req.login removed to avoid potential 'next is not a function' error from passport interaction
    return res.status(200).json({
      _id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      token: 'dummy-token-if-using-jwt',
      message: 'Email verified successfully. You can now login.'
    });

  } catch (error) {
     res.status(500).json({ message: error.message });
  }
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public (or Private)
router.post('/resend-otp', async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'UniXHub Verification Code (Resent)',
      text: `Your new verification code is ${otp}.`,
      html: `<p>Your new verification code is: <strong>${otp}</strong></p>`
    });

    res.json({ message: 'OTP resent successfully' });
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
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in.' });
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

// @desc    Request password reset (send OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Please provide email' });
  }

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send OTP via email
    await sendEmail({
      email: user.email,
      subject: 'UniXHub - Password Reset Code',
      text: `Your password reset code is ${otp}. It is valid for 10 minutes.`,
      html: `<p>Your password reset code is: <strong>${otp}</strong></p><p>It is valid for 10 minutes.</p>`
    });

    res.json({ message: 'Password reset code sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify reset OTP
// @route   POST /api/auth/verify-reset-otp
// @access  Public
router.post('/verify-reset-otp', async (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ message: 'Please provide email and OTP' });
  }

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.resetPasswordOtpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Mark OTP as verified (we'll check this when resetting password)
    user.resetPasswordOtpVerified = true;
    await user.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Please provide email, OTP, and new password' });
  }

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.resetPasswordOtpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (!user.resetPasswordOtpVerified) {
      return res.status(400).json({ message: 'Please verify OTP first' });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    user.resetPasswordOtpVerified = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now login with your new password.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

// @desc    Google Login/Signup
// @route   POST /api/auth/google
// @access  Public
router.post('/google', async (req, res, next) => {
  const { email, firstName, lastName, firebaseUid, role, collegeName } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      // User exists - Login flow
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
        await user.save();
      }
      
      // Ensure user is verified if they are logging in via Google (email is trusted)
      if (!user.isVerified) {
         user.isVerified = true;
         await user.save();
      }

      // Log them in via Passport (optional, but good for session)
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.json({
          _id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin,
          message: 'Logged in with Google successfully'
        });
      });
      
    } else {
      // User does not exist - Signup flow
      if (!role) {
        // If no role provided, we can't register them yet. 
        // Frontend should handle this by asking for role or redirecting to signup
        return res.status(404).json({ 
          message: 'Account not found. Please sign up to choose your role.',
          isNewUser: true 
        });
      }

      // Validate Student Role
      if (role === 'student' && !collegeName) {
        return res.status(400).json({ message: 'College name is required for students' });
      }

      // Create new user
      const userData = {
        firstName: firstName || 'User',
        lastName: lastName || '',
        email,
        password: crypto.randomBytes(16).toString('hex'), // Random password for Google users
        role,
        collegeName: role === 'student' ? collegeName : undefined,
        firebaseUid,
        isVerified: true, // Google emails are verified
      };

      user = await User.create(userData);

      req.logIn(user, (err) => {
         if (err) return next(err);
         res.status(201).json({
            _id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            message: 'User registered with Google successfully'
         });
      });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
