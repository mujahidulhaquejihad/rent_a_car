import { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminDashboard.css';

const STATUS_COLORS = {
  pending: 'pending',
  accepted: 'active',
  rejected: 'inactive',
  in_progress: 'active',
  completed: 'active',
  cancelled: 'inactive',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/bookings').then(({ data }) => {
      if (data.success) setBookings(data.bookings || []);
    }).catch(() => setBookings([])).finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => (d ? new Date(d).toLocaleString() : '—');

  if (loading) return <div className="admin-page"><p>Loading...</p></div>;

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Bookings</h1>
      <p className="admin-page-sub">All ride bookings.</p>
      <div className="admin-table-wrap card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Car</th>
              <th>Type</th>
              <th>Pickup</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.user?.name}<br /><small>{b.user?.email}</small></td>
                <td>{b.car?.brand} {b.car?.model}</td>
                <td>{b.bookingType === 'body_bhara' ? 'Body Bhara' : 'Full Book'}</td>
                <td>{formatDate(b.pickupDate)}<br /><small>{b.pickupLocation}</small></td>
                <td>৳{b.totalAmount}</td>
                <td>
                  <span className={`admin-badge ${STATUS_COLORS[b.status] || 'inactive'}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
