const asyncHandler = require('express-async-handler');
const GraphicDesignService = require('./model');

// @desc    Get all graphic design services
// @route   GET /api/graphic-design
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  const services = await GraphicDesignService.find({ isActive: true });
  res.status(200).json(services);
});

// @desc    Create a new service (Admin)
// @route   POST /api/graphic-design
// @access  Private
const createService = asyncHandler(async (req, res) => {
  const { title, description, icon, iconType, color, buttonText, category } = req.body;

  if (!title || !icon) {
    res.status(400);
    throw new Error('Please add a title and icon');
  }

  const service = await GraphicDesignService.create({
    title,
    description,
    icon,
    iconType: iconType || 'lucide', // Default to Lucide if not specified
    color,
    buttonText,
    category
  });

  res.status(201).json(service);
});

// @desc    Update a service/item (Partner)
// @route   PUT /api/graphic-design/:id
// @access  Private
const updateService = asyncHandler(async (req, res) => {
  const service = await GraphicDesignService.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const updatedService = await GraphicDesignService.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedService);
});

// @desc    Delete a service
// @route   DELETE /api/graphic-design/:id
// @access  Private
const deleteService = asyncHandler(async (req, res) => {
  const service = await GraphicDesignService.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  await service.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};
