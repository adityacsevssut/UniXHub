const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    iconName:    { type: String, default: 'Code' },
    description: { type: String },
    tags:        { type: [String], default: [] },
    color:       { type: String, default: '#3b82f6' },
    path:        { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', ServiceSchema);
