const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @route   GET /api/partners
// @desc    Get all partners (Publicly accessible for directory, filtered by service)
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { serviceId } = req.query;
  let query = {};
  
  if (serviceId) {
    // Case-insensitive regex for flexibility
    query.serviceId = { $regex: serviceId, $options: 'i' };
  }

  const partners = await Partner.find(query).select('-password');
  res.json(partners);
}));

// @route   POST /api/partners
// @desc    Register a new partner
// @access  Private (Developer)
router.post('/', upload.single('image'), asyncHandler(async (req, res) => {
  console.log('Register Partner Request Body:', req.body);
  if (req.file) console.log('File uploaded:', req.file);

  const { name, email, businessId, serviceId, password } = req.body;
  
  // If file uploaded, use path. Else fallback to body (if user sends URL string) or empty
  let imagePath = '';
  if (req.file) {
    // Return relative path for frontend access via /uploads route
    imagePath = `/uploads/${req.file.filename}`; 
  } else if (req.body.image) {
    imagePath = req.body.image;
  }

  const partnerExists = await Partner.findOne({ $or: [{ email }, { businessId }] });

  if (partnerExists) {
    res.status(400);
    throw new Error('Partner already exists with this email or Business ID');
  }

  const partner = await Partner.create({
    name,
    email,
    businessId,
    serviceId,
    password,
    image: imagePath
  });

  if (partner) {
    res.status(201).json({
      _id: partner._id,
      name: partner.name,
      email: partner.email,
      businessId: partner.businessId,
      serviceId: partner.serviceId,
      image: partner.image
    });
  } else {
    res.status(400);
    throw new Error('Invalid partner data');
  }
}));

// @route   PUT /api/partners/:id
// @desc    Update partner
// @access  Private (Developer)
router.put('/:id', upload.single('image'), asyncHandler(async (req, res) => {
  const partner = await Partner.findById(req.params.id);

  if (partner) {
    partner.name = req.body.name || partner.name;
    partner.email = req.body.email || partner.email;
    partner.businessId = req.body.businessId || partner.businessId;
    partner.serviceId = req.body.serviceId || partner.serviceId;

    if (req.body.password) {
      partner.password = req.body.password;
    }
    
    if (req.file) {
      partner.image = `/uploads/${req.file.filename}`;
    }

    const updatedPartner = await partner.save();

    res.json({
      _id: updatedPartner._id,
      name: updatedPartner.name,
      email: updatedPartner.email,
      businessId: updatedPartner.businessId,
      serviceId: updatedPartner.serviceId,
      image: updatedPartner.image
    });
  } else {
    res.status(404);
    throw new Error('Partner not found');
  }
}));

// @route   DELETE /api/partners/:id
// @desc    Delete a partner
// @access  Private (Developer)
router.delete('/:id', asyncHandler(async (req, res) => {
  const partner = await Partner.findById(req.params.id);

  if (partner) {
    await partner.deleteOne();
    res.json({ message: 'Partner removed' });
  } else {
    res.status(404);
    throw new Error('Partner not found');
  }
}));

// @route   POST /api/partners/login
// @desc    Auth partner & get token (Login)
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { businessId, password } = req.body;

  const partner = await Partner.findOne({ businessId });

  if (partner && (await partner.matchPassword(password))) {
    res.json({
      _id: partner._id,
      name: partner.name,
      email: partner.email,
      businessId: partner.businessId,
      role: partner.role,
      serviceId: partner.serviceId
      // token: generateToken(partner._id) // Token implementation omitted for simplicity
    });
  } else {
    res.status(401);
    throw new Error('Invalid Business ID or Password');
  }
}));

module.exports = router;
