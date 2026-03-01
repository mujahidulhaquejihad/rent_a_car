const User = require('../models/User');
const DriverProfile = require('../models/DriverProfile');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const path = require('path');

// @route   POST /api/drivers/register
exports.registerDriver = async (req, res) => {
  try {
    const { licenseNo, nidOrPassport } = req.body;
    const user = await User.findById(req.user.id);
    if (user.role === 'driver') return res.status(400).json({ success: false, message: 'Already a driver' });

    const licenseImage = req.file ? '/uploads/' + path.basename(req.file.path) : undefined;
    await User.findByIdAndUpdate(req.user.id, { role: 'driver' });
    const profile = await DriverProfile.create({
      user: req.user.id,
      licenseNo,
      nidOrPassport,
      licenseImage,
    });
    res.status(201).json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/drivers/profile
exports.getDriverProfile = async (req, res) => {
  try {
    const profile = await DriverProfile.findOne({ user: req.user.id }).populate('user', 'name email phone photo');
    if (!profile) return res.status(404).json({ success: false, message: 'Driver profile not found' });
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/drivers/earnings
exports.getEarnings = async (req, res) => {
  try {
    const completed = await Booking.find({ driver: req.user.id, status: 'completed' }).select('totalAmount createdAt');
    const total = completed.reduce((s, b) => s + b.totalAmount, 0);
    const profile = await DriverProfile.findOne({ user: req.user.id });
    res.json({
      success: true,
      totalEarnings: total,
      profileEarnings: profile?.totalEarnings ?? 0,
      totalRides: completed.length,
      rides: completed.reverse(),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/drivers/ride-requests
exports.getRideRequests = async (req, res) => {
  try {
    const bookings = await Booking.find({ driver: req.user.id, status: 'pending' })
      .populate('car user').sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
