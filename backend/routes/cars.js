const express = require('express');
const router = express.Router();
const { getCars, getCarById, createCar, updateCar } = require('../controllers/carController');
const { protect, authorize } = require('../middleware/auth');
const { uploadMultiple } = require('../utils/upload');

router.get('/', getCars);
router.get('/:id', getCarById);

router.post('/', protect, authorize('driver', 'admin'), uploadMultiple, createCar);
router.put('/:id', protect, authorize('driver', 'admin'), uploadMultiple, updateCar);

module.exports = router;
