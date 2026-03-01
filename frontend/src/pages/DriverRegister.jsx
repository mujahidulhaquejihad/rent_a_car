import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import './DriverRegister.css';

export default function DriverRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [licenseNo, setLicenseNo] = useState('');
  const [nidOrPassport, setNidOrPassport] = useState('');
  const [licenseImage, setLicenseImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData();
    formData.append('licenseNo', licenseNo);
    formData.append('nidOrPassport', nidOrPassport);
    if (licenseImage) formData.append('photo', licenseImage);
    try {
      const { data } = await api.post('/drivers/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data.success) navigate('/driver');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="driver-register card">
        <h1>{t('driver.registerAsDriver')}</h1>
        <p className="hint">Submit your license and documents to become a driver.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('driver.licenseNo')}</label>
            <input type="text" value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>{t('driver.nidOrPassport')}</label>
            <input type="text" value={nidOrPassport} onChange={(e) => setNidOrPassport(e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t('driver.licenseImage')}</label>
            <input type="file" accept="image/*" onChange={(e) => setLicenseImage(e.target.files?.[0])} />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? t('common.loading') : t('common.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
