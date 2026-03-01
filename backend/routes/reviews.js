const express = require('express');
const router = express.Router();
const { createReview, getDriverReviews, getCarReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/driver/:driverId', getDriverReviews);
router.get('/car/:carId', getCarReviews);

module.exports = router;
