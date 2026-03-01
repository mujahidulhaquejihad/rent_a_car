import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import './Auth.css';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      if (data.success) {
        setStep('otp');
        setMessage(data.devOtp ? `OTP sent. For dev: ${data.devOtp}` : 'OTP sent to your email.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndGoReset = () => {
    navigate('/reset-password', { state: { email, otp } });
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1>{t('auth.forgotPassword')}</h1>
        {step === 'email' ? (
          <form onSubmit={sendOtp}>
            <div className="form-group">
              <label>{t('auth.email')}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            {error && <p className="error-msg">{error}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? t('common.loading') : t('auth.sendOtp')}
            </button>
          </form>
        ) : (
          <>
            {message && <p className="success-msg">{message}</p>}
            <div className="form-group">
              <label>{t('auth.enterOtp')}</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6 digits" maxLength={6} />
            </div>
            <button type="button" className="btn btn-primary btn-block" onClick={verifyAndGoReset} disabled={otp.length < 6}>
              {t('auth.resetPassword')}
            </button>
          </>
        )}
        <p className="auth-footer"><Link to="/login">{t('common.back')} to Login</Link></p>
      </div>
    </div>
  );
}
