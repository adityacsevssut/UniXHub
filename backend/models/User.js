const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    firstName:  { type: String, required: true },
    lastName:   { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String },
    role:       { type: String, required: true },
    collegeName:{ type: String },
    firebaseUid:{ type: String },
    isVerified: { type: Boolean, default: false },
    isAdmin:    { type: Boolean, default: false },
    otp:        { type: String },
    otpExpires: { type: Date },
    resetPasswordOtp:         { type: String },
    resetPasswordOtpExpires:  { type: Date },
    resetPasswordOtpVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Virtual: full name
UserSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Match entered password against stored hash
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving if modified
UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);
