const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  getDrivers,
  getCars,
  getBookings,
  setUserActive,
  setCarActive,
  verifyDriver,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/drivers', getDrivers);
router.get('/cars', getCars);
router.get('/bookings', getBookings);
router.put('/users/:id/active', setUserActive);
router.put('/cars/:id/active', setCarActive);
router.put('/drivers/:id/verify', verifyDriver);

module.exports = router;
