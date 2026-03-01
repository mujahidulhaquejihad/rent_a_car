const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const DriverProfile = require('../models/DriverProfile');

// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [usersCount, driversCount, carsCount, bookingsCount] = await Promise.all([
      User.countDocuments({ role: { $in: ['user', 'driver'] } }),
      User.countDocuments({ role: 'driver' }),
      Car.countDocuments({ isActive: true }),
      Booking.countDocuments(),
    ]);
    const recentBookings = await Booking.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
    res.json({
      success: true,
      stats: {
        users: usersCount,
        drivers: driversCount,
        cars: carsCount,
        bookings: bookingsCount,
        recentBookings,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 }).lean();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/admin/drivers
exports.getDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' }).select('-password').sort({ createdAt: -1 }).lean();
    const profiles = await DriverProfile.find({ user: { $in: drivers.map((d) => d._id) } }).lean();
    const byId = {};
    profiles.forEach((p) => { byId[p.user.toString()] = p; });
    const withProfile = drivers.map((d) => ({ ...d, driverProfile: byId[d._id.toString()] }));
    res.json({ success: true, drivers: withProfile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/admin/cars
exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find().populate('owner', 'name email phone').sort({ createdAt: -1 }).lean();
    res.json({ success: true, cars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/admin/bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user car driver', 'name email phone model brand').sort({ createdAt: -1 }).lean();
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/admin/users/:id/active
exports.setUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot modify admin' });
    user.isActive = req.body.isActive !== false;
    await user.save();
    res.json({ success: true, user: { id: user._id, isActive: user.isActive } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/admin/cars/:id/active
exports.setCarActive = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive !== false }, { new: true });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, car: { id: car._id, isActive: car.isActive } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/admin/drivers/:id/verify
exports.verifyDriver = async (req, res) => {
  try {
    const profile = await DriverProfile.findOneAndUpdate(
      { user: req.params.id },
      { isVerified: true },
      { new: true }
    );
    if (!profile) return res.status(404).json({ success: false, message: 'Driver profile not found' });
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
