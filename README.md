# Rent A Car System (MERN)

A full-stack car rental platform with user and driver flows, bookings (Body Bhara & Full Book), payments, reviews, and English/Bangla + dark/light mode.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer, Nodemailer
- **Frontend:** React 18, Vite, React Router, Axios, i18next (EN/BN), CSS variables (theme)

## Features

| # | Feature | Description |
|---|--------|-------------|
| 1 | User Registration | Create account with name, email, phone, password |
| 2 | User Login & Forgot Password | Login with email/phone; reset password via OTP (email) |
| 4 | User Profile | Update name, phone, and profile photo |
| 5 | Car Listings | View all available cars with summary |
| 6 | Car Details | Model, type, features, availability, price, images |
| 7 | Car Type Selection | Sedan, Micro, SUV, Premium |
| 8 | Search & Filter | By name, price range, availability |
| 9 | Booking Type | Body Bhara or Full Book |
| 10 | Body Bhara | Fuel and driver cost paid separately |
| 11 | Full Book | All-inclusive per-day package |
| 12 | Ride Booking | Pickup date, time, location (with Google Maps picker) |
| 13 | Booking Confirmation | Confirm details before payment |
| 14 | Online Payment | Payment method selection (online/cash) |
| 15 | Cash on Delivery | Pay after ride completion |
| 16 | Booking History | Past and upcoming bookings |
| 17 | Cancellation | Cancel with reason; car availability updated |
| 18 | User Review & Rating | Rate driver and car after completed ride |
| 19 | Driver Registration | License and documents |
| 20 | Driver Car Registration | Add car details, images, availability |
| 21 | Driver Ride Panel | Accept/reject booking requests |
| 22 | Driver Earnings | Completed rides and total earnings |
| 23 | Driver Review User | Drivers rate passengers |
| 24 | Language | English / Bangla toggle |
| 25 | Day/Night Mode | Light/Dark theme toggle |

## Project Structure

```
Rent_a_Car/
├── backend/           # Express API
│   ├── config/        # DB connection
│   ├── controllers/
│   ├── middleware/    # auth, authorize
│   ├── models/        # User, Car, Booking, Review, Otp, DriverProfile
│   ├── routes/
│   ├── uploads/       # Uploaded images
│   ├── utils/         # sendOtp, upload (multer)
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/          # React (Vite)
│   ├── src/
│   │   ├── components/ # Layout, Navbar
│   │   ├── context/   # Auth, Theme
│   │   ├── i18n/      # en, bn
│   │   ├── pages/     # Home, Login, Cars, Booking, Driver*, etc.
│   │   ├── services/ # api (axios)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET, and optionally SMTP_* for OTP emails
npm install
npm run dev
```

Server runs at `http://localhost:5000`. Health: `GET /api/health`.

### Frontend

```bash
cd frontend
cp .env.example .env   # optional: set VITE_GOOGLE_MAPS_API_KEY for map picker
npm install
npm run dev
```

App runs at `http://localhost:3000`. Vite proxies `/api` and `/uploads` to the backend.

**Google Maps (pickup/drop location):** On the booking page, pickup and drop location can be set by clicking on a map. Create a key in [Google Cloud Console](https://console.cloud.google.com/), enable **Maps JavaScript API** and **Geocoding API**, then set `VITE_GOOGLE_MAPS_API_KEY` in `frontend/.env`. Without it, the booking page still works with text-only address fields.

### Environment (backend .env)

| Variable | Description |
|----------|-------------|
| PORT | Server port (default 5000) |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Secret for JWT signing |
| JWT_EXPIRE | e.g. 7d |
| CLIENT_URL | Frontend origin (for CORS) |
| SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS | For OTP email (e.g. Gmail app password) |

If SMTP is not set, OTP is logged in the backend console (for development).

## API Overview

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/forgot-password`, `POST /api/auth/verify-otp`, `POST /api/auth/reset-password`, `GET /api/auth/me` (protected)
- **Users:** `GET/PUT /api/users/profile` (protected)
- **Cars:** `GET /api/cars`, `GET /api/cars/:id`, `POST /api/cars`, `PUT /api/cars/:id` (create/update require driver)
- **Bookings:** `POST /api/bookings`, `GET /api/bookings`, `GET /api/bookings/:id`, `PUT /api/bookings/:id/accept`, `reject`, `cancel`, `complete`, `payment` (protected)
- **Reviews:** `POST /api/reviews`, `GET /api/reviews/driver/:driverId`, `GET /api/reviews/car/:carId`
- **Drivers:** `POST /api/drivers/register`, `GET /api/drivers/profile`, `GET /api/drivers/earnings`, `GET /api/drivers/ride-requests` (protected, driver role)

## Admin panel

- **URL:** After login as admin, go to `/admin` (or click **Admin** in the navbar).
- **Create admin user:** From the `backend` folder run:
  ```bash
  npm run seed:admin
  ```
  This creates one admin account. Use it to log in on the main site (Login page).

- **Admin login credentials:**
  - **Email:** `admin@rentacar.com`
  - **Password:** `Admin@123`

  (If you run `npm run seed` for cars, the same admin user is created automatically.)

- **Admin can:** View dashboard stats (users, drivers, cars, bookings), list and activate/deactivate users, verify drivers, hide/show cars, view all bookings.

## Seed 100 cars (optional)

To populate the app with 100 sample cars (with car images and different types):

```bash
cd backend
npm run seed
```

This creates a demo driver and 100 cars (Sedan, Micro, SUV, Premium) with placeholder images. The homepage will then show "Choose from 100 cars" with a full grid.

## Quick Test Flow

1. (Optional) Run `npm run seed` in `backend` to add 100 cars.
2. Register a user → Login.
2. Browse Cars → open a car → Book Now (Body Bhara or Full Book) → confirm and pay (cash/online).
3. Register as driver (Profile area or “Become a Driver”) → Add Car → see ride requests and earnings.
4. Use navbar to switch Language (EN/বাং) and Theme (day/night).

---

**Rent A Car** – MERN stack project with all 25 requested features.
