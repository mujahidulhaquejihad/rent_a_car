import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import './DriverRideRequests.css';

export default function DriverRideRequests() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/drivers/ride-requests').then(({ data }) => {
      if (data.success) setBookings(data.bookings || []);
    }).catch(() => setBookings([])).finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const accept = async (id) => {
    try {
      await api.put(`/bookings/${id}/accept`);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const reject = async (id) => {
    try {
      await api.put(`/bookings/${id}/reject`);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const complete = async (id) => {
    try {
      await api.put(`/bookings/${id}/complete`, { paymentReceived: true });
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '';

  if (loading) return <div className="container"><p>{t('common.loading')}</p></div>;

  return (
    <div className="container">
      <h1 className="page-title">{t('nav.rideRequests')}</h1>
      {bookings.length === 0 ? (
        <p className="no-data">{t('common.noData')}</p>
      ) : (
        <div className="ride-requests-list">
          {bookings.map((b) => (
            <div key={b._id} className="card ride-card">
              <div className="ride-header">
                <span>{b.car?.brand} {b.car?.model}</span>
                <span className="status">{t('booking.status')}: {t('booking.pending')}</span>
              </div>
              <p><strong>User:</strong> {b.user?.name} — {b.user?.phone}</p>
              <p>{t('booking.pickupDate')}: {formatDate(b.pickupDate)} | {b.pickupTime}</p>
              <p>{t('booking.pickupLocation')}: {b.pickupLocation}</p>
              <p><strong>{t('booking.totalAmount')}: ৳{b.totalAmount}</strong></p>
              <div className="ride-actions">
                <button type="button" className="btn btn-primary btn-sm" onClick={() => accept(b._id)}>{t('booking.accept')}</button>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => reject(b._id)}>{t('booking.reject')}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
