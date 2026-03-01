import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import './Cars.css';

const TYPES = ['Sedan', 'Micro', 'SUV', 'Premium'];

export default function Cars() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const typeFromUrl = searchParams.get('type') || '';
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(typeFromUrl);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    setType(typeFromUrl);
  }, [typeFromUrl]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (search) params.set('search', search);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    setLoading(true);
    api.get('/cars?' + params.toString()).then(({ data }) => {
      if (data.success) setCars(data.cars || []);
    }).catch(() => setCars([])).finally(() => setLoading(false));
  }, [type, search, minPrice, maxPrice]);

  const imgUrl = (path) => getImageUrl(path);

  return (
    <div className="container">
      <h1 className="page-title">{t('car.availableCars')}</h1>
      <div className="filters card">
        <div className="filter-row">
          <input
            type="text"
            placeholder={t('car.searchByName')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">{t('car.carTypes')}</option>
            {TYPES.map((tpe) => (
              <option key={tpe} value={tpe}>{t(`car.${tpe.toLowerCase()}`)}</option>
            ))}
          </select>
          <input type="number" placeholder={t('car.minPrice')} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <input type="number" placeholder={t('car.maxPrice')} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
      </div>
      {loading ? (
        <p>{t('common.loading')}</p>
      ) : cars.length === 0 ? (
        <p className="no-data">{t('common.noData')}</p>
      ) : (
        <div className="cars-grid">
          {cars.map((car) => (
            <div key={car._id} className="card car-card">
              <div className="car-image">
                {car.images?.[0] && (
                  <img
                    src={imgUrl(car.images[0])}
                    alt={car.model}
                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextElementSibling?.classList.add('show'); }}
                  />
                )}
                <div className={`car-placeholder ${!car.images?.[0] ? 'show' : ''}`}>{car.brand?.[0]}</div>
                <span className={`badge ${car.availability}`}>{t(`car.${car.availability}`)}</span>
              </div>
              <div className="car-info">
                <h3>{car.brand} {car.model}</h3>
                <p className="car-type">{t(`car.${(car.type || '').toLowerCase()}`)}</p>
                <div className="car-prices">
                  {car.bodyBharaPerKm != null && <span>{t('car.bodyBhara')}: ৳{car.bodyBharaPerKm} {t('car.perKm')}</span>}
                  {car.fullBookPerDay != null && <span>{t('car.fullBook')}: ৳{car.fullBookPerDay} {t('car.perDay')}</span>}
                </div>
                <Link to={`/cars/${car._id}`} className="btn btn-primary btn-sm">{t('car.viewDetails')}</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
