const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toCar: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  type: { type: String, enum: ['user_to_driver', 'user_to_car', 'driver_to_user'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
