import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Cars from './pages/Cars';
import CarDetail from './pages/CarDetail';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Booking from './pages/Booking';
import BookingHistory from './pages/BookingHistory';
import DriverRegister from './pages/DriverRegister';
import DriverDashboard from './pages/DriverDashboard';
import DriverRideRequests from './pages/DriverRideRequests';
import DriverEarnings from './pages/DriverEarnings';
import AddCar from './pages/AddCar';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDrivers from './pages/admin/AdminDrivers';
import AdminCars from './pages/admin/AdminCars';
import AdminBookings from './pages/admin/AdminBookings';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function App() {
  const { i18n } = useTranslation();
  useEffect(() => {
    document.body.setAttribute('lang', i18n.language === 'bn' ? 'bn' : 'en');
  }, [i18n.language]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="cars" element={<Cars />} />
        <Route path="cars/:id" element={<CarDetail />} />
        <Route path="about" element={<About />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="bookings" element={<PrivateRoute><BookingHistory /></PrivateRoute>} />
        <Route path="book/:carId" element={<PrivateRoute><Booking /></PrivateRoute>} />
        <Route path="driver/register" element={<PrivateRoute><DriverRegister /></PrivateRoute>} />
        <Route path="driver" element={<PrivateRoute><DriverDashboard /></PrivateRoute>} />
        <Route path="driver/rides" element={<PrivateRoute><DriverRideRequests /></PrivateRoute>} />
        <Route path="driver/earnings" element={<PrivateRoute><DriverEarnings /></PrivateRoute>} />
        <Route path="driver/cars/new" element={<PrivateRoute><AddCar /></PrivateRoute>} />
      </Route>
      <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="drivers" element={<AdminDrivers />} />
        <Route path="cars" element={<AdminCars />} />
        <Route path="bookings" element={<AdminBookings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
