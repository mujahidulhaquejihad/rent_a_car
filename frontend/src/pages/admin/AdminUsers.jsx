import { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminDashboard.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users').then(({ data }) => {
      if (data.success) setUsers(data.users || []);
    }).catch(() => setUsers([])).finally(() => setLoading(false));
  }, []);

  const toggleActive = async (id, current) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/active`, { isActive: !current });
      if (data.success) setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive: data.user.isActive } : u)));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="admin-page"><p>Loading...</p></div>;

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Users</h1>
      <p className="admin-page-sub">Manage registered users.</p>
      <div className="admin-table-wrap card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.role}</td>
                <td>
                  <span className={`admin-badge ${u.isActive ? 'active' : 'inactive'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => toggleActive(u._id, u.isActive)}>
                    {u.isActive ? 'Deactivate' : 'Activate'}
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
