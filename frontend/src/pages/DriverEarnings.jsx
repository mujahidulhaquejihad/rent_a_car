import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import './DriverEarnings.css';

export default function DriverEarnings() {
  const { t } = useTranslation();
  const [data, setData] = useState({ totalEarnings: 0, totalRides: 0, rides: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/drivers/earnings').then(({ data: res }) => {
      if (res.success) setData({ totalEarnings: res.totalEarnings, totalRides: res.totalRides, rides: res.rides || [] });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '';

  if (loading) return <div className="container"><p>{t('common.loading')}</p></div>;

  return (
    <div className="container">
      <h1 className="page-title">{t('nav.earnings')}</h1>
      <div className="earnings-summary card">
        <div className="stat">
          <span className="stat-label">{t('driver.totalEarnings')}</span>
          <span className="stat-value">৳{data.totalEarnings}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t('driver.totalRides')}</span>
          <span className="stat-value">{data.totalRides}</span>
        </div>
      </div>
      <h2 className="section-title">Ride history</h2>
      {data.rides.length === 0 ? (
        <p className="no-data">{t('common.noData')}</p>
      ) : (
        <div className="earnings-list">
          {data.rides.map((r) => (
            <div key={r._id} className="card earning-row">
              <span>{formatDate(r.createdAt)}</span>
              <span className="amount">৳{r.totalAmount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
