import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-logo">Rent A Car Admin</Link>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" className="admin-nav-link" end>Dashboard</NavLink>
          <NavLink to="/admin/users" className="admin-nav-link">Users</NavLink>
          <NavLink to="/admin/drivers" className="admin-nav-link">Drivers</NavLink>
          <NavLink to="/admin/cars" className="admin-nav-link">Cars</NavLink>
          <NavLink to="/admin/bookings" className="admin-nav-link">Bookings</NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-link">← Back to site</Link>
          <button type="button" className="admin-logout" onClick={() => { logout(); navigate('/'); }}>
            Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
