const mongoose = require('mongoose');

const GraphicDesignServiceSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String },
    icon:        { type: String },
    iconType:    { type: String, default: 'lucide' },
    color:       { type: String, default: '#3b82f6' },
    buttonText:  { type: String, default: 'Start Designing' },
    category:    { type: String, default: 'service' },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GraphicDesignService', GraphicDesignServiceSchema);
