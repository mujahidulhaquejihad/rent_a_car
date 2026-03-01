import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => {
      if (data.success) setStats(data.stats);
    }).catch(() => setStats(null)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-page"><p>Loading...</p></div>;
  if (!stats) return <div className="admin-page"><p>Failed to load stats.</p></div>;

  const cards = [
    { label: 'Total Users', value: stats.users, link: '/admin/users', color: 'var(--primary)' },
    { label: 'Drivers', value: stats.drivers, link: '/admin/drivers', color: 'var(--teal)' },
    { label: 'Cars', value: stats.cars, link: '/admin/cars', color: 'var(--amber)' },
    { label: 'Total Bookings', value: stats.bookings, link: '/admin/bookings', color: 'var(--accent)' },
    { label: 'Bookings (last 7 days)', value: stats.recentBookings, color: 'var(--success)' },
  ];

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-sub">Overview of your Rent A Car platform.</p>
      <div className="admin-stats-grid">
        {cards.map((c) => (
          <div key={c.label} className="admin-stat-card card">
            <span className="admin-stat-value" style={{ color: c.color }}>{c.value}</span>
            <span className="admin-stat-label">{c.label}</span>
            {c.link && <Link to={c.link} className="admin-stat-link">View →</Link>}
          </div>
        ))}
      </div>
    </div>
  );
}
