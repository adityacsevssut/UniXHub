const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const Service = require('../models/Service');
const GraphicDesign = require('../services/graphicDesign/model');
const Partner = require('../models/Partner');
const WorkShowcase = require('../services/workShowcase/model');

// Helper to extract exported array from file content
const extractData = (filePath, variableName) => {
  try {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = new RegExp(`export const ${variableName} =\\s*(\\[[\\s\\S]*?\\]);`, 'm');
    const match = content.match(regex);
    if (match && match[1]) {
      return eval(match[1]); 
    }
    return [];
  } catch (err) {
    console.error(`Error extracting ${variableName}:`, err);
    return [];
  }
};

// @desc    Seed comprehensive database from frontend assets
// @route   POST /api/seed
// @access  Private (Developer) - simpler access for now as per request
const seedDatabase = asyncHandler(async (req, res) => {
  try {
    // 1. Load Data Paths
    const graphicDesignPath = path.join(__dirname, '../../frontend/src/assets/data/graphicDesignData.js');
    const servicesPath = path.join(__dirname, '../../frontend/src/assets/data/servicesData.js');
    const showcasePath = path.join(__dirname, '../../frontend/src/assets/data/showcaseData.js');

    // 2. Extract Data
    const designOptionsData = extractData(graphicDesignPath, 'designOptionsData');
    const graphicServicesData = extractData(graphicDesignPath, 'servicesData');
    const mainServicesData = extractData(servicesPath, 'services');
    const showcaseData = extractData(showcasePath, 'showcaseData');

    // 3. Clear Database
    await Service.deleteMany();
    await GraphicDesign.deleteMany();
    await Partner.deleteMany();
    await WorkShowcase.deleteMany();

    // 4. Seed Main Services
    if (mainServicesData.length > 0) {
      const services = mainServicesData.map(service => ({
         title: service.title,
         description: service.description,
         iconName: service.iconName,
         color: service.color
      }));
      await Service.insertMany(services);
    }

    // 5. Seed Graphic Design Options
    const quickActions = designOptionsData.map(item => ({
      title: item.title,
      description: "Quick Action",
      category: 'quick_action',
      icon: item.iconName,
      iconType: 'lucide',
      color: item.color,
      buttonText: 'Start Designing'
    }));

    const graphicServices = graphicServicesData.map(item => ({
      title: item.name,
      description: item.desc,
      icon: item.iconName,
      iconType: 'lucide',
      color: '#3b82f6',
      category: 'service'
    }));

    if (quickActions.length > 0 || graphicServices.length > 0) {
      await GraphicDesign.insertMany([...quickActions, ...graphicServices]);
    }

    // 6. Seed Partner (Aditya Nahak)
    const partner = await Partner.create({
      name: 'Aditya Nahak',
      email: 'aditya@example.com',
      businessId: 'ADITYA_DESIGN_01',
      serviceId: 'Graphic Design',
      password: 'password123',
      role: 'partner',
      image: 'https://ui-avatars.com/api/?name=Aditya+Nahak&background=0D8ABC&color=fff'
    });

    // 7. Seed Work Showcase
    if (showcaseData.length > 0) {
      const showcaseItems = showcaseData.map(item => ({
        title: item.title,
        description: item.description,
        image: item.image,
        link: item.link,
        category: item.category,
        partnerId: partner._id
      }));

      await WorkShowcase.insertMany(showcaseItems);
    }

    res.status(200).json({
      message: 'Database seeded successfully',
      stats: {
        services: mainServicesData.length,
        graphicItems: quickActions.length + graphicServices.length,
        showcaseItems: showcaseData.length,
        partnerCreated: partner.name
      }
    });

  } catch (error) {
    res.status(500);
    throw new Error(`Seeding failed: ${error.message}`);
  }
});

module.exports = { seedDatabase };
