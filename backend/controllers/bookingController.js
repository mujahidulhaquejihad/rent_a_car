const Booking = require('../models/Booking');
const Car = require('../models/Car');

// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { car, bookingType, pickupDate, pickupTime, pickupLocation, dropLocation, estimatedKm, days, paymentMethod } = req.body;
    const carDoc = await Car.findById(car);
    if (!carDoc) return res.status(404).json({ success: false, message: 'Car not found' });
    if (carDoc.availability !== 'available') return res.status(400).json({ success: false, message: 'Car not available' });

    let totalAmount = 0;
    let fuelCost, driverCost;
    if (bookingType === 'body_bhara') {
      const km = Number(estimatedKm) || 0;
      totalAmount = (carDoc.bodyBharaPerKm || 0) * km;
      fuelCost = req.body.fuelCost != null ? Number(req.body.fuelCost) : 0;
      driverCost = req.body.driverCost != null ? Number(req.body.driverCost) : 0;
      totalAmount += fuelCost + driverCost;
    } else {
      const d = Math.max(1, Number(days) || 1);
      totalAmount = (carDoc.fullBookPerDay || 0) * d;
    }

    const booking = await Booking.create({
      user: req.user.id,
      car,
      driver: carDoc.owner,
      bookingType,
      pickupDate,
      pickupTime,
      pickupLocation,
      dropLocation,
      estimatedKm,
      days: bookingType === 'full_book' ? (Number(days) || 1) : undefined,
      totalAmount,
      fuelCost,
      driverCost,
      paymentMethod: paymentMethod || 'cash',
    });
    await booking.populate(['car', 'user', 'driver']);
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/bookings - user's bookings
exports.getMyBookings = async (req, res) => {
  try {
    const filter = req.user.role === 'driver' ? { driver: req.user.id } : { user: req.user.id };
    const bookings = await Booking.find(filter).populate('car user driver').sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('car user driver');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user._id.toString() !== req.user.id && booking.driver?._id?.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/bookings/:id/accept
exports.acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('car');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.driver.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (booking.status !== 'pending') return res.status(400).json({ success: false, message: 'Invalid status' });

    booking.status = 'accepted';
    await booking.save();
    if (booking.car) {
      booking.car.availability = 'unavailable';
      await booking.car.save();
    }
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/bookings/:id/reject
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.driver.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (booking.status !== 'pending') return res.status(400).json({ success: false, message: 'Invalid status' });

    booking.status = 'rejected';
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('car');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    const isUser = booking.user.toString() === req.user.id;
    const isDriver = booking.driver?.toString() === req.user.id;
    if (!isUser && !isDriver && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Not authorized' });

    if (!['pending', 'accepted'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancelledBy = isDriver ? 'driver' : 'user';
    booking.cancellationReason = req.body.reason || '';
    await booking.save();
    if (booking.car && booking.car.availability === 'unavailable') {
      booking.car.availability = 'available';
      await booking.car.save();
    }
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/bookings/:id/complete
exports.completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('car');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.driver.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (booking.status !== 'accepted' && booking.status !== 'in_progress') return res.status(400).json({ success: false, message: 'Invalid status' });

    booking.status = 'completed';
    booking.paymentStatus = req.body.paymentReceived ? 'paid' : booking.paymentStatus;
    await booking.save();
    if (booking.car) {
      booking.car.availability = 'available';
      await booking.car.save();
    }

    const DriverProfile = require('../models/DriverProfile');
    await DriverProfile.findOneAndUpdate(
      { user: req.user.id },
      { $inc: { totalRides: 1, totalEarnings: booking.totalAmount } },
      { upsert: true }
    );

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/bookings/:id/payment
exports.updatePayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    booking.paymentStatus = 'paid';
    booking.paymentMethod = req.body.paymentMethod || booking.paymentMethod;
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
