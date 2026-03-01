const mongoose = require('mongoose');

const driverProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  licenseNo: { type: String, required: true },
  licenseImage: { type: String },
  nidOrPassport: { type: String },
  documentImages: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  totalEarnings: { type: Number, default: 0 },
  totalRides: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('DriverProfile', driverProfileSchema);
