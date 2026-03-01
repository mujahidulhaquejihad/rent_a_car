const Car = require('../models/Car');
const path = require('path');

// @route   GET /api/cars - list all (with search/filter)
exports.getCars = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, search, availability } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;
    if (availability) filter.availability = availability;
    if (search) {
      filter.$or = [
        { model: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') },
      ];
    }

    let query = Car.find(filter).populate('owner', 'name phone').lean();

    if (minPrice != null || maxPrice != null) {
      const priceFilter = {};
      if (minPrice != null) priceFilter.$gte = Number(minPrice);
      if (maxPrice != null) priceFilter.$lte = Number(maxPrice);
      query = query.find({
        $or: [
          { bodyBharaPerKm: priceFilter },
          { fullBookPerDay: priceFilter },
        ],
      });
    }

    const cars = await query;
    res.json({ success: true, count: cars.length, cars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/cars/:id
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('owner', 'name phone');
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   POST /api/cars - driver add car
exports.createCar = async (req, res) => {
  try {
    const body = { ...req.body, owner: req.user.id };
    if (req.files?.length) body.images = req.files.map((f) => '/uploads/' + path.basename(f.path));
    const car = await Car.create(body);
    res.status(201).json({ success: true, car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/cars/:id
exports.updateCar = async (req, res) => {
  try {
    let car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    if (car.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const updates = { ...req.body };
    delete updates.images;
    if (req.files?.length) {
      updates.$push = { images: { $each: req.files.map((f) => '/uploads/' + path.basename(f.path)) } };
    }
    car = await Car.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
