import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Profile.css';

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    if (photo) formData.append('photo', photo);
    try {
      const { data } = await api.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data.success) {
        updateUser(data.user);
        setMessage('Profile updated.');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="profile-page card">
        <h1>{t('common.profile')}</h1>
        <div className="profile-photo">
          {user?.photo ? (
            <img src={user.photo.startsWith('http') ? user.photo : `${import.meta.env.VITE_API_URL || ''}${user.photo}`} alt="Profile" />
          ) : (
            <div className="photo-placeholder">{user?.name?.[0]?.toUpperCase() || '?'}</div>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('auth.name')}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>{t('auth.email')}</label>
            <input type="text" value={user?.email} readOnly disabled />
          </div>
          <div className="form-group">
            <label>{t('auth.phone')}</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0])} />
          </div>
          {message && <p className={message.includes('failed') ? 'error-msg' : 'success-msg'}>{message}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? t('common.loading') : t('common.save')}
          </button>
        </form>
      </div>
    </div>
  );
}
