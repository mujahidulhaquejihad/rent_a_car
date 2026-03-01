import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLang = () => {
    const next = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;

  return (
    <header className="navbar">
      <div className="navbar-accent" aria-hidden="true" />
      <div className="container navbar-inner">
        <Link to="/" className="logo" onClick={() => setMobileOpen(false)}>
          <span className="logo-icon" aria-hidden="true">🚗</span>
          <span className="logo-text">Rent A Car</span>
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          <span className="navbar-toggle-bar" />
          <span className="navbar-toggle-bar" />
          <span className="navbar-toggle-bar" />
        </button>

        <div className={`nav-menu ${mobileOpen ? 'open' : ''}`}>
        <nav className="nav-links">
          <NavLink to="/" className={navLinkClass} end onClick={() => setMobileOpen(false)}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/cars" className={navLinkClass} onClick={() => setMobileOpen(false)}>
            {t('nav.cars')}
          </NavLink>
          {user && (
            <NavLink to="/bookings" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              {t('nav.bookings')}
            </NavLink>
          )}
          {user?.role === 'driver' && (
            <>
              <NavLink to="/driver" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                {t('nav.driverDashboard')}
              </NavLink>
              <NavLink to="/driver/rides" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                {t('nav.rideRequests')}
              </NavLink>
              <NavLink to="/driver/earnings" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                {t('nav.earnings')}
              </NavLink>
            </>
          )}
          {user && user.role !== 'driver' && user.role !== 'admin' && (
            <NavLink to="/driver/register" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              {t('nav.becomeDriver')}
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="nav-actions">
          <div className="nav-actions-utils">
            <button
              type="button"
              className="icon-btn"
              onClick={handleLang}
              title={t('common.language')}
              aria-label="Toggle language"
            >
              {i18n.language === 'en' ? 'বাং' : 'EN'}
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              title={dark ? t('common.lightMode') : t('common.darkMode')}
              aria-label="Toggle theme"
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
          <div className="nav-actions-auth">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('common.profile')}
                </Link>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleLogout}>
                  {t('common.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('common.login')}
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('common.register')}
                </Link>
              </>
            )}
          </div>
        </div>
        </div>
      </div>
    </header>
  );
}
