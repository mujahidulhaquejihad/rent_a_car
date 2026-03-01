const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');
const { v4: uuidv4 } = require('uuid');

const getSixDigitOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const createTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

exports.sendOtpEmail = async (email, purpose = 'forgot_password') => {
  const otp = getSixDigitOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await Otp.create({ email, otp, purpose, expiresAt });

  const transporter = createTransporter();
  if (!transporter) {
    console.warn('SMTP not configured. OTP (for dev):', otp);
    return { success: true, devOtp: otp };
  }

  const subject = purpose === 'forgot_password' ? 'Reset your password - Rent A Car' : 'Verify your email - Rent A Car';
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject,
    text: `Your OTP is: ${otp}. Valid for 10 minutes.`,
    html: `<p>Your OTP is: <strong>${otp}</strong>. Valid for 10 minutes.</p>`,
  });
  return { success: true };
};

exports.verifyOtp = async (email, otp, purpose) => {
  const record = await Otp.findOne({ email, purpose, used: false }).sort({ createdAt: -1 });
  if (!record) return { valid: false, message: 'OTP not found or expired' };
  if (record.expiresAt < new Date()) return { valid: false, message: 'OTP expired' };
  if (record.otp !== otp) return { valid: false, message: 'Invalid OTP' };
  record.used = true;
  await record.save();
  return { valid: true };
};
