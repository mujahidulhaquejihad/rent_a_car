import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Auth.css';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const isEmail = emailOrPhone.includes('@');
    const body = isEmail ? { email: emailOrPhone, password } : { phone: emailOrPhone, password };
    try {
      const { data } = await api.post('/auth/login', body);
      if (data.success) {
        login(data.token, data.user);
        if (data.user.role === 'admin') navigate('/admin');
        else if (data.user.role === 'driver') navigate('/driver');
        else navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1>{t('common.login')}</h1>
        <p className="auth-hint">{t('auth.loginWithEmailOrPhone')}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('auth.email')} / {t('auth.phone')}</label>
            <input type="text" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} required placeholder="email or phone" />
          </div>
          <div className="form-group">
            <label>{t('auth.password')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div className="form-group">
            <Link to="/forgot-password" className="forgot-link">{t('auth.forgotPassword')}</Link>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? t('common.loading') : t('common.login')}
          </button>
        </form>
        <p className="auth-footer">Don't have an account? <Link to="/register">{t('common.register')}</Link></p>
      </div>
    </div>
  );
}
