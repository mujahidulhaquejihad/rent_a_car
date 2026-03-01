/**
 * Seed 100 cars with different types and car images.
 * Run: node scripts/seedCars.js (from backend folder, with MONGODB_URI in .env)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Car = require('../models/Car');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rent_a_car';

// Local car pictures (frontend public/carpictures) – served at /carpictures/xxx
const CAR_IMAGES = [
  '/carpictures/pexels-mikebirdy-136872.jpg',
  '/carpictures/pexels-bertellifotografia-3007436.jpg',
  '/carpictures/pexels-christian-9-454702-1164778.jpg',
  '/carpictures/pexels-svjae-3764984.jpg',
  '/carpictures/pexels-mikebirdy-170811.jpg',
  '/carpictures/pexels-mikebirdy-112460.jpg',
  '/carpictures/pexels-pixabay-163213.jpg',
  '/carpictures/pexels-vladalex94-1402787.jpg',
  '/carpictures/pexels-mikebirdy-120049.jpg',
  '/carpictures/pexels-mikebirdy-116675.jpg',
  '/carpictures/pexels-pixabay-210019.jpg',
  '/carpictures/pexels-georgesultan-1410013.jpg',
  '/carpictures/pexels-prime-cinematics-1005175-2036544.jpg',
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
