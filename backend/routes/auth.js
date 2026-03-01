const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, forgotPassword, verifyOtp, resetPassword, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('phone').trim().notEmpty(),
  body('password').isLength({ min: 6 }),
], register);

router.post('/login', login);
router.post('/forgot-password', body('email').isEmail(), forgotPassword);
router.post('/verify-otp', body('email').isEmail(), body('otp').notEmpty(), verifyOtp);
router.post('/reset-password', [
  body('email').isEmail(),
  body('otp').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
], resetPassword);

router.get('/me', protect, getMe);

module.exports = router;
