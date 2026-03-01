import { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminDashboard.css';

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/drivers').then(({ data }) => {
      if (data.success) setDrivers(data.drivers || []);
    }).catch(() => setDrivers([])).finally(() => setLoading(false));
  }, []);

  const verify = async (id) => {
    try {
      await api.put(`/admin/drivers/${id}/verify`);
      setDrivers((prev) => prev.map((d) => (d._id === id ? { ...d, driverProfile: { ...d.driverProfile, isVerified: true } } : d)));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="admin-page"><p>Loading...</p></div>;

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Drivers</h1>
      <p className="admin-page-sub">Driver accounts and verification.</p>
      <div className="admin-table-wrap card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>License</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.email}</td>
                <td>{d.phone}</td>
                <td>{d.driverProfile?.licenseNo || '—'}</td>
                <td>
                  <span className={`admin-badge ${d.driverProfile?.isVerified ? 'active' : 'inactive'}`}>
                    {d.driverProfile?.isVerified ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>
                  {!d.driverProfile?.isVerified && (
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => verify(d._id)}>
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
