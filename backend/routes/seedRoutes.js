const express = require('express');
const router = express.Router();
const { seedDatabase } = require('../controllers/seedController');

// @route   POST /api/seed
// @desc    Seed database from frontend assets
// @access  Public (for dev convenience) or Protected
router.post('/', seedDatabase);

module.exports = router;
