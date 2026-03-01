const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadSingle } = require('../utils/upload');

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', uploadSingle, updateProfile);

module.exports = router;
