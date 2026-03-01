import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import './AddCar.css';

const TYPES = ['Sedan', 'Micro', 'SUV', 'Premium'];

export default function AddCar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    model: '', brand: '', type: 'Sedan', year: '', registrationNo: '', color: '', seats: 4,
    bodyBharaPerKm: '', fullBookPerDay: '', driverIncluded: false, features: '',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== '' && v != null) formData.append(k, v); });
    images.forEach((file) => formData.append('images', file));
    try {
      const { data } = await api.post('/cars', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data.success) navigate('/driver');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="add-car card">
        <h1>{t('driver.addCar')}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('driver.brand')}</label>
            <input name="brand" value={form.brand} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{t('driver.model')}</label>
            <input name="model" value={form.model} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{t('driver.type')}</label>
            <select name="type" value={form.type} onChange={handleChange}>
              {TYPES.map((tpe) => <option key={tpe} value={tpe}>{t(`car.${tpe.toLowerCase()}`)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>{t('driver.year')}</label>
            <input name="year" type="number" value={form.year} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t('driver.registrationNo')}</label>
            <input name="registrationNo" value={form.registrationNo} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t('driver.color')}</label>
            <input name="color" value={form.color} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t('driver.seats')}</label>
            <input name="seats" type="number" min="1" value={form.seats} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t('driver.bodyBharaPerKm')} (৳)</label>
            <input name="bodyBharaPerKm" type="number" min="0" value={form.bodyBharaPerKm} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{t('driver.fullBookPerDay')} (৳)</label>
            <input name="fullBookPerDay" type="number" min="0" value={form.fullBookPerDay} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>
              <input name="driverIncluded" type="checkbox" checked={form.driverIncluded} onChange={handleChange} />
              {t('driver.driverIncluded')}
            </label>
          </div>
          <div className="form-group">
            <label>{t('car.features')} (comma separated)</label>
            <input name="features" value={form.features} onChange={handleChange} placeholder="AC, Music, etc." />
          </div>
          <div className="form-group">
            <label>Images</label>
            <input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files || []))} />
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
