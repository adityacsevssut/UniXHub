const express = require('express');
const router = express.Router();

// @desc    Test GET route
// @route   GET /api/test
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend is connected and routing works!' });
});

module.exports = router;
