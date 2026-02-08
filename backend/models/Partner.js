const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  businessId: {
    type: String,
    required: true,
    unique: true
  },
  serviceId: {
    type: String, // e.g., 'Graphic Design', 'Frontend Development'
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true
  },
  plainPassword: {
    type: String
  },
  role: {
    type: String,
    default: 'partner'
  }
}, {
  timestamps: true
});

// Match user entered password to hashed password in database
partnerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
partnerSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }

  this.plainPassword = this.password;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Partner', partnerSchema);
