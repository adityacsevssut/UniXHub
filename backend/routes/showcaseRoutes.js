const express = require('express');
const router = express.Router();
const WorkShowcase = require('../services/workShowcase/model');
const asyncHandler = require('express-async-handler');

// @route   GET /api/showcase
// @desc    Get all showcases (optionally filtered by partnerId)
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { partnerId } = req.query;
  const query = partnerId ? { partnerId } : {};
  const showcases = await WorkShowcase.find(query).sort({ createdAt: -1 });
  res.json(showcases);
}));

// @route   POST /api/showcase
// @desc    Add a new showcase item
// @access  Private (Partner)
router.post('/', asyncHandler(async (req, res) => {
  const { partnerId, title, description, image, link, category } = req.body;

  if (!partnerId || !title || !image) {
    res.status(400);
    throw new Error('Please provide all required fields (partnerId, title, image)');
  }

  const showcase = await WorkShowcase.create({
    partnerId,
    title,
    description,
    image,
    link,
    category
  });

  res.status(201).json(showcase);
}));

// @route   DELETE /api/showcase/:id
// @desc    Delete a showcase item
// @access  Private (Partner)
router.delete('/:id', asyncHandler(async (req, res) => {
  const showcase = await WorkShowcase.findById(req.params.id);

  if (showcase) {
    await showcase.deleteOne();
    res.json({ message: 'Showcase item removed' });
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
}));

module.exports = router;
