/**
 * Create default admin user for Rent A Car.
 * Run: node scripts/seedAdmin.js (from backend folder)
 *
 * Admin login:
 *   Email:    admin@rentacar.com
 *   Password: Admin@123
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rent_a_car';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: 'admin@rentacar.com' });
  if (existing) {
    console.log('Admin already exists. Email: admin@rentacar.com');
    await mongoose.disconnect();
    return;
  }

  await User.create({
    name: 'Admin',
    email: 'admin@rentacar.com',
    phone: '01800000000',
    password: 'Admin@123',
    role: 'admin',
  });
  console.log('Admin user created successfully.');
  console.log('');
  console.log('  Login with:');
  console.log('  Email:    admin@rentacar.com');
  console.log('  Password: Admin@123');
  console.log('');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
