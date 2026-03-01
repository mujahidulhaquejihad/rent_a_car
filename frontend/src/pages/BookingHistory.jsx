import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import ReviewForm from '../components/ReviewForm';
import './BookingHistory.css';

const STATUS_MAP = { pending: 'pending', accepted: 'accepted', rejected: 'rejected', in_progress: 'inProgress', completed: 'completed', cancelled: 'cancelled' };

export default function BookingHistory() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    api.get('/bookings').then(({ data }) => {
      if (data.success) setBookings(data.bookings || []);
    }).catch(() => setBookings([])).finally(() => setLoading(false));
  }, []);

  const cancelBooking = async (id, reason) => {
    setCancelling(id);
    try {
      await api.put(`/bookings/${id}/cancel`, { reason: reason || 'User cancelled' });
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b)));
    } finally {
      setCancelling(null);
    }
  };

  const filtered = filter === 'upcoming'
    ? bookings.filter((b) => ['pending', 'accepted', 'in_progress'].includes(b.status))
    : filter === 'past'
      ? bookings.filter((b) => ['completed', 'cancelled', 'rejected'].includes(b.status))
      : bookings;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '';

  if (loading) return <div className="container"><p>{t('common.loading')}</p></div>;

  return (
    <div className="container">
      <h1 className="page-title">{t('booking.bookingHistory')}</h1>
      <div className="filter-tabs">
        <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button type="button" className={filter === 'upcoming' ? 'active' : ''} onClick={() => setFilter('upcoming')}>{t('booking.upcoming')}</button>
        <button type="button" className={filter === 'past' ? 'active' : ''} onClick={() => setFilter('past')}>{t('booking.past')}</button>
      </div>
      {filtered.length === 0 ? (
        <p className="no-data">{t('common.noData')}</p>
      ) : (
        <div className="booking-list">
          {filtered.map((b) => (
            <div key={b._id} className="card booking-card">
              <div className="booking-header">
                <span className="car-name">{b.car?.brand} {b.car?.model}</span>
                <span className={`status-badge ${b.status}`}>{t(`booking.${STATUS_MAP[b.status] || b.status}`)}</span>
              </div>
              <p>{t('booking.pickupDate')}: {formatDate(b.pickupDate)} | {b.pickupTime}</p>
              <p>{t('booking.pickupLocation')}: {b.pickupLocation}</p>
              <p><strong>{t('booking.totalAmount')}: ৳{b.totalAmount}</strong></p>
              {['pending', 'accepted'].includes(b.status) && (
                <button type="button" className="btn btn-outline btn-sm" onClick={() => cancelBooking(b._id)} disabled={cancelling === b._id}>
                  {t('booking.cancelRide')}
                </button>
              )}
              {b.status === 'completed' && (
                <ReviewForm bookingId={b._id} onDone={() => {}} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
