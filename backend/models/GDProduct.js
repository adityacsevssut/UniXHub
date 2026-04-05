const mongoose = require('mongoose');

const GDProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  badge: { type: String, default: null },
  rating: { type: String, default: "4.5" },
  image: { type: String, required: true }, // URL
  description: { type: String },
  brand: { type: String, default: 'UniXHub Originals' },
  features: { type: [String], default: ['Secure Transaction', 'Instant Download', 'Free Updates', 'Premium Quality'] },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' }
}, { timestamps: true });

module.exports = mongoose.model('GDProduct', GDProductSchema);
