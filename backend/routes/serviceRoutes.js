const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Simple In-Memory Cache
let serviceCache = {
  data: null,
  timestamp: 0,
  duration: 10 * 60 * 1000 // 10 minutes
};

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Check Cache
    if (serviceCache.data && (Date.now() - serviceCache.timestamp < serviceCache.duration)) {
        return res.json(serviceCache.data);
    }

    const services = await Service.find();
    
    // Update Cache
    serviceCache.data = services;
    serviceCache.timestamp = Date.now();

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/services
// @desc    Create a new service
// @access  Private (Developer)
router.post('/', async (req, res) => {
  const service = new Service({
    title: req.body.title,
    iconName: req.body.iconName,
    description: req.body.description,
    color: req.body.color,
    path: req.body.path,
    tags: req.body.tags
  });

  try {
    const newService = await service.save();
    
    // Invalidate Cache
    serviceCache.data = null;
    serviceCache.timestamp = 0;

    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/services/:id
// @desc    Update a service
// @access  Private (Developer)
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
        return res.status(404).json({ message: 'Service not found' });
    }

    service.title = req.body.title || service.title;
    service.iconName = req.body.iconName || service.iconName;
    service.description = req.body.description || service.description;
    service.color = req.body.color || service.color;
    service.path = req.body.path || service.path;
    service.tags = req.body.tags || service.tags;

    const updatedService = await service.save();

    // Invalidate Cache
    serviceCache.data = null;
    serviceCache.timestamp = 0;

    res.json(updatedService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete a service
// @access  Private (Developer)
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
        return res.status(404).json({ message: 'Service not found' });
    }
    
    await Service.findByIdAndDelete(req.params.id);

    // Invalidate Cache
    serviceCache.data = null;
    serviceCache.timestamp = 0;

    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
