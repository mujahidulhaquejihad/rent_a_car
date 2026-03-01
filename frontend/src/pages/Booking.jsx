import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import MapPicker from '../components/MapPicker';
import './Booking.css';

export default function Booking() {
  const { t } = useTranslation();
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [bookingType, setBookingType] = useState('body_bhara');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [estimatedKm, setEstimatedKm] = useState('');
  const [days, setDays] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [fuelCost, setFuelCost] = useState('');
  const [driverCost, setDriverCost] = useState('');
  const [confirmStep, setConfirmStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/cars/' + carId).then(({ data }) => {
      if (data.success) setCar(data.car);
    }).catch(() => setCar(null));
  }, [carId]);

  const totalAmount = () => {
    if (!car) return 0;
    if (bookingType === 'body_bhara') {
      const km = Number(estimatedKm) || 0;
      const base = (car.bodyBharaPerKm || 0) * km;
      return base + Number(fuelCost || 0) + Number(driverCost || 0);
    }
    return (car.fullBookPerDay || 0) * Math.max(1, Number(days) || 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = {
      car: carId,
      bookingType,
      pickupDate,
      pickupTime,
      pickupLocation,
      dropLocation,
      paymentMethod,
    };
    if (bookingType === 'body_bhara') {
      payload.estimatedKm = estimatedKm;
      payload.fuelCost = fuelCost || 0;
      payload.driverCost = driverCost || 0;
    } else {
      payload.days = days;
    }
    try {
      const { data } = await api.post('/bookings', payload);
      if (data.success) {
        navigate('/bookings');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!car) return <div className="container"><p>{t('common.loading')}</p></div>;

  return (
    <div className="container">
      <div className="booking-page card">
        <h1>{t('booking.confirmBooking')}</h1>
        <p className="car-name">{car.brand} {car.model}</p>
        {!confirmStep ? (
          <form onSubmit={(e) => { e.preventDefault(); setConfirmStep(true); }}>
            <div className="form-group">
              <label>{t('booking.bookingType')}</label>
              <div className="booking-type-options">
                <label className="radio-label">
                  <input type="radio" name="type" value="body_bhara" checked={bookingType === 'body_bhara'} onChange={() => setBookingType('body_bhara')} />
                  {t('car.bodyBhara')} — {t('booking.bodyBharaDesc')}
                </label>
                <label className="radio-label">
                  <input type="radio" name="type" value="full_book" checked={bookingType === 'full_book'} onChange={() => setBookingType('full_book')} />
                  {t('car.fullBook')} — {t('booking.fullBookDesc')}
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>{t('booking.pickupDate')}</label>
              <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>{t('booking.pickupTime')}</label>
              <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} required />
            </div>
            <MapPicker
              label={t('booking.pickupLocation')}
              value={pickupLocation}
              onChange={setPickupLocation}
              placeholder="Click on map to pinpoint or type address"
              required
            />
            <MapPicker
              label={t('booking.dropLocation')}
              value={dropLocation}
              onChange={setDropLocation}
              placeholder="Click on map to pinpoint or type address (optional)"
            />
            {bookingType === 'body_bhara' && (
              <>
                <div className="form-group">
                  <label>{t('booking.estimatedKm')}</label>
                  <input type="number" min="1" value={estimatedKm} onChange={(e) => setEstimatedKm(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Fuel cost (৳)</label>
                  <input type="number" min="0" value={fuelCost} onChange={(e) => setFuelCost(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Driver cost (৳)</label>
                  <input type="number" min="0" value={driverCost} onChange={(e) => setDriverCost(e.target.value)} />
                </div>
              </>
            )}
            {bookingType === 'full_book' && (
              <div className="form-group">
                <label>{t('booking.days')}</label>
                <input type="number" min="1" value={days} onChange={(e) => setDays(e.target.value)} />
              </div>
            )}
            <div className="form-group">
              <label>{t('booking.paymentMethod')}</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="cash">{t('booking.cashOnDelivery')}</option>
                <option value="online">{t('booking.onlinePayment')}</option>
              </select>
            </div>
            <p className="total-preview">{t('booking.totalAmount')}: ৳{totalAmount()}</p>
            <button type="submit" className="btn btn-primary">{t('common.next')}</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="confirm-summary">
              <p><strong>{t('booking.pickupDate')}:</strong> {pickupDate}</p>
              <p><strong>{t('booking.pickupTime')}:</strong> {pickupTime}</p>
              <p><strong>{t('booking.pickupLocation')}:</strong> {pickupLocation}</p>
              {dropLocation && <p><strong>{t('booking.dropLocation')}:</strong> {dropLocation}</p>}
              <p><strong>{t('booking.totalAmount')}:</strong> ৳{totalAmount()}</p>
              <p><strong>{t('booking.paymentMethod')}:</strong> {paymentMethod === 'cash' ? t('booking.cashOnDelivery') : t('booking.onlinePayment')}</p>
            </div>
            {error && <p className="error-msg">{error}</p>}
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setConfirmStep(false)}>{t('common.back')}</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? t('common.loading') : t('booking.confirmBooking')}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
