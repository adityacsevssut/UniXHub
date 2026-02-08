const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  iconName: {
    type: String, // Storing icon name as string to map on frontend
    required: true,
    default: 'Code'
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String], // Array of strings
    default: []
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  path: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
