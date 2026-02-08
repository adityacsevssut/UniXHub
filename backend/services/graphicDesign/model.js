const mongoose = require('mongoose');

const graphicDesignServiceSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: false, // Make this optional as quick actions might not have it
    },
    icon: {
      type: String, // Can be Lucide name OR Image URL
      required: [true, 'Please add an icon'],
    },
    iconType: {
      type: String,
      enum: ['lucide', 'url'],
      default: 'lucide',
      required: true
    },
    color: {
      type: String,
      default: '#3b82f6'
    },
    buttonText: {
      type: String,
      default: 'Start Designing'
    },
    category: {
      type: String,
      enum: ['quick_action', 'service'], 
      default: 'service',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('GraphicDesignService', graphicDesignServiceSchema);
