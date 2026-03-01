const Review = require('../models/Review');
const Booking = require('../models/Booking');
const DriverProfile = require('../models/DriverProfile');

// @route   POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment, type } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status !== 'completed') return res.status(400).json({ success: false, message: 'Can only review completed rides' });
    const isUser = booking.user.toString() === req.user.id;
    const isDriver = booking.driver?.toString() === req.user.id;
    if (type === 'driver_to_user') {
      if (!isDriver) return res.status(403).json({ success: false, message: 'Not authorized' });
    } else if (!isUser) return res.status(403).json({ success: false, message: 'Not authorized' });

    const existing = await Review.findOne({ booking: bookingId, fromUser: req.user.id, type });
    if (existing) return res.status(400).json({ success: false, message: 'Already reviewed' });

    const payload = { booking: bookingId, fromUser: req.user.id, rating, comment, type };
    if (type === 'user_to_driver' || type === 'user_to_car') {
      payload.toDriver = booking.driver;
      payload.toCar = booking.car;
    } else if (type === 'driver_to_user') {
      payload.toUser = booking.user;
    }

    const review = await Review.create(payload);

    if (type === 'user_to_driver' && booking.driver) {
      const reviews = await Review.find({ toDriver: booking.driver, type: 'user_to_driver' });
      const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
      await DriverProfile.findOneAndUpdate({ user: booking.driver }, { averageRating: Math.round(avg * 10) / 10 });
    }

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/reviews/driver/:driverId
exports.getDriverReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ toDriver: req.params.driverId, type: 'user_to_driver' })
      .populate('fromUser', 'name').sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/reviews/car/:carId
exports.getCarReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ toCar: req.params.carId, type: 'user_to_car' })
      .populate('fromUser', 'name').sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
