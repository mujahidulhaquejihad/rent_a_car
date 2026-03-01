import { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminDashboard.css';

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/cars').then(({ data }) => {
      if (data.success) setCars(data.cars || []);
    }).catch(() => setCars([])).finally(() => setLoading(false));
  }, []);

  const toggleActive = async (id, current) => {
    try {
      const { data } = await api.put(`/admin/cars/${id}/active`, { isActive: !current });
      if (data.success) setCars((prev) => prev.map((c) => (c._id === id ? { ...c, isActive: data.car.isActive } : c)));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="admin-page"><p>Loading...</p></div>;

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Cars</h1>
      <p className="admin-page-sub">All registered cars.</p>
      <div className="admin-table-wrap card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Brand / Model</th>
              <th>Type</th>
              <th>Owner</th>
              <th>Availability</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((c) => (
              <tr key={c._id}>
                <td><strong>{c.brand}</strong> {c.model}</td>
                <td>{c.type}</td>
                <td>{c.owner?.name || c.owner?.email || '—'}</td>
                <td>{c.availability}</td>
                <td>
                  <span className={`admin-badge ${c.isActive ? 'active' : 'inactive'}`}>
                    {c.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => toggleActive(c._id, c.isActive)}>
                    {c.isActive ? 'Hide' : 'Show'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
