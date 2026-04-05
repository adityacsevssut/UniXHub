const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PartnerSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true },
    email:         { type: String, required: true, unique: true },
    businessId:    { type: String, required: true, unique: true },
    serviceId:     { type: String, required: true },
    image:         { type: String, default: '' },
    password:      { type: String, required: true },
    plainPassword: { type: String },
    role:          { type: String, default: 'partner' },
  },
  { timestamps: true }
);

// Match entered password against stored hash
PartnerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving if modified
PartnerSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Partner', PartnerSchema);
