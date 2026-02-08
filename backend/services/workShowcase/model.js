const mongoose = require('mongoose');

const showcaseSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  link: {
    type: String // Optional external link (e.g., Behance, Dribbble)
  },
  category: {
    type: String, // e.g., 'Banner', 'Logo', 'Poster'
    default: 'General'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WorkShowcase', showcaseSchema);
