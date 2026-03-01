const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  model: { type: String, required: true },
  brand: { type: String, required: true },
  type: { type: String, enum: ['Sedan', 'Micro', 'SUV', 'Premium', 'Other'], required: true },
  year: { type: Number },
  registrationNo: { type: String },
  color: { type: String },
  seats: { type: Number, default: 4 },
  features: [{ type: String }],
  images: [{ type: String }],
  availability: { type: String, enum: ['available', 'unavailable', 'in_ride'], default: 'available' },
  bodyBharaPerKm: { type: Number },
  fullBookPerDay: { type: Number },
  fullBookMinDays: { type: Number, default: 1 },
  driverIncluded: { type: Boolean, default: false },
  documentsVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
