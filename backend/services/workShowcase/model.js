const mongoose = require('mongoose');

const WorkShowcaseSchema = new mongoose.Schema(
  {
    partnerId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
    title:       { type: String, required: true },
    description: { type: String },
    image:       { type: String },
    link:        { type: String },
    category:    { type: String, default: 'General' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkShowcase', WorkShowcaseSchema);
