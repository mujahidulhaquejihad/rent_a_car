const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookingType: { type: String, enum: ['body_bhara', 'full_book'], required: true },
  pickupDate: { type: Date, required: true },
  pickupTime: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String },
  estimatedKm: { type: Number },
  days: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: { type: String, enum: ['online', 'cash'], default: 'cash' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  totalAmount: { type: Number, required: true },
  fuelCost: { type: Number },
  driverCost: { type: Number },
  cancellationReason: { type: String },
  cancelledAt: { type: Date },
  cancelledBy: { type: String, enum: ['user', 'driver', 'admin', 'system'] },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
