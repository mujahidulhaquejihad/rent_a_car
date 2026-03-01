const express = require('express');
const router = express.Router();
const { registerDriver, getDriverProfile, getEarnings, getRideRequests } = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');
const { uploadSingle } = require('../utils/upload');

router.use(protect);
router.post('/register', uploadSingle, registerDriver);
router.get('/profile', authorize('driver', 'admin'), getDriverProfile);
router.get('/earnings', authorize('driver', 'admin'), getEarnings);
router.get('/ride-requests', authorize('driver', 'admin'), getRideRequests);

module.exports = router;
