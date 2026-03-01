/**
 * Seed 100 cars with different types and car images.
 * Run: node scripts/seedCars.js (from backend folder, with MONGODB_URI in .env)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Car = require('../models/Car');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rent_a_car';

// Unsplash car images (free to use) - varied cars/sedans/SUVs
const CAR_IMAGES = [
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1494976380902-2fdc818f4c8?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1502877338533-6bb6ca1e68?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1544636331-f26539776a?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551524555-8a29c2e2ca?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1563720225-e9bfe4a58d?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1609521263047-d0c2d0e307?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1619767886550-ef664c1a318?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1541899481282-d53bfe3c35fd?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1619767886550-ef664c1a318?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&h=400&fit=crop',
];

const BRANDS = ['Toyota', 'Honda', 'Nissan', 'BMW', 'Mercedes', 'Audi', 'Hyundai', 'Suzuki', 'Mitsubishi', 'Ford', 'Chevrolet', 'Volkswagen', 'Kia', 'Mazda', 'Lexus'];
const MODELS_BY_TYPE = {
  Sedan: ['Camry', 'Accord', 'Corolla', 'Civic', 'Altima', '3 Series', 'C-Class', 'A4', 'Elantra', 'Swift', 'Lancer', 'Focus', 'Cruze', 'Jetta', 'Optima'],
  Micro: ['Alto', 'Wagon R', 'Celerio', 'i10', 'Picanto', 'Spark', 'Mirage', 'Eon', 'Santro', 'Celerio', 'Kwid', 'Redi-GO', 'Ertiga', 'Eeco', 'Dzire'],
  SUV: ['Land Cruiser', 'Prado', 'Fortuner', 'CR-V', 'X-Trail', 'X5', 'GLE', 'Q7', 'Tucson', 'Vitara', 'Pajero', 'Everest', 'Trailblazer', 'Tiguan', 'Sorento'],
  Premium: ['S-Class', '7 Series', 'A8', 'LS', 'Panamera', 'Continental', 'Phantom', 'Bentayga', 'Cullinan', 'G-Wagon', 'Range Rover', 'Cayenne', 'Urus', 'Levante', 'DBX'],
};
const COLORS = ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Pearl White', 'Midnight Black', 'Metallic Gray'];

function pick(arr, i) {
  return arr[i % arr.length];
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Ensure admin user exists
  let admin = await User.findOne({ email: 'admin@rentacar.com' });
  if (!admin) {
    admin = await User.create({
      name: 'Admin',
      email: 'admin@rentacar.com',
      phone: '01800000000',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log('Created admin user: admin@rentacar.com / Admin@123');
  }

  let driver = await User.findOne({ email: 'seeddriver@rentacar.demo' });
  if (!driver) {
    driver = await User.create({
      name: 'Demo Driver',
      email: 'seeddriver@rentacar.demo',
      phone: '01700000000',
      password: 'demo123456',
      role: 'driver',
    });
    console.log('Created seed driver');
  }

  const types = ['Sedan', 'Micro', 'SUV', 'Premium'];
  const carsToInsert = [];
  for (let i = 0; i < 100; i++) {
    const type = pick(types, i);
    const brand = pick(BRANDS, i);
    const models = MODELS_BY_TYPE[type];
    const model = pick(models || MODELS_BY_TYPE.Sedan, i);
    const img = pick(CAR_IMAGES, i);
    const basePrice = type === 'Premium' ? 80 : type === 'SUV' ? 50 : type === 'Sedan' ? 35 : 25;
    carsToInsert.push({
      owner: driver._id,
      brand,
      model,
      type,
      year: 2018 + (i % 7),
      color: pick(COLORS, i),
      seats: type === 'SUV' ? 7 : type === 'Premium' ? 5 : 4,
      features: ['AC', 'Music', 'Power Windows'].slice(0, 2 + (i % 2)),
      images: [img],
      availability: 'available',
      bodyBharaPerKm: basePrice + (i % 15),
      fullBookPerDay: basePrice * 25 + (i % 500),
      driverIncluded: i % 3 === 0,
      documentsVerified: true,
      isActive: true,
    });
  }

  await Car.deleteMany({ owner: driver._id });
  await Car.insertMany(carsToInsert);
  console.log('Inserted 100 cars');

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
