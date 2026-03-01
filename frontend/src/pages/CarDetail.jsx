import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getCarImageUrl, CAR_PICTURES } from '../utils/imageUrl';
import './CarDetail.css';

export default function CarDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cars/' + id).then(({ data }) => {
      if (data.success) setCar(data.car);
    }).catch(() => setCar(null)).finally(() => setLoading(false));
    api.get('/reviews/car/' + id).then(({ data }) => {
      if (data.success) setReviews(data.reviews || []);
    }).catch(() => setReviews([]));
  }, [id]);


  if (loading) return <div className="container"><p>{t('common.loading')}</p></div>;
  if (!car) return <div className="container"><p>{t('common.noData')}</p><Link to="/cars">← {t('car.availableCars')}</Link></div>;

  return (
    <div className="container">
      <div className="car-detail card">
        <div className="car-detail-gallery">
          {CAR_PICTURES.slice(0, 6).map((src, i) => (
            <img
              key={i}
              src={getCarImageUrl(car, i)}
              alt={`${car.brand} ${car.model} ${i + 1}`}
            />
          ))}
        </div>
        <div className="car-detail-info">
          <h1>{car.brand} {car.model}</h1>
          <p className="car-type">{t(`car.${(car.type || '').toLowerCase()}`)}</p>
          <p><strong>{t('car.availability')}:</strong> {t(`car.${car.availability}`)}</p>
          {car.year && <p><strong>Year:</strong> {car.year}</p>}
          {car.registrationNo && <p><strong>{t('driver.registrationNo')}:</strong> {car.registrationNo}</p>}
          {car.color && <p><strong>{t('driver.color')}:</strong> {car.color}</p>}
          {car.seats && <p><strong>{t('driver.seats')}:</strong> {car.seats}</p>}
          {car.features?.length > 0 && (
            <p><strong>{t('car.features')}:</strong> {car.features.join(', ')}</p>
          )}
          <div className="prices">
            {car.bodyBharaPerKm != null && (
              <div className="price-block">
                <span className="label">{t('car.bodyBhara')}</span>
                <span className="value">৳{car.bodyBharaPerKm} {t('car.perKm')}</span>
              </div>
            )}
            {car.fullBookPerDay != null && (
              <div className="price-block">
                <span className="label">{t('car.fullBook')}</span>
                <span className="value">৳{car.fullBookPerDay} {t('car.perDay')}</span>
              </div>
            )}
          </div>
          {user && car.availability === 'available' && (
            <Link to={`/book/${car._id}`} className="btn btn-primary">{t('car.bookNow')}</Link>
          )}
          {!user && <Link to="/login" className="btn btn-primary">{t('common.login')} to {t('car.bookNow')}</Link>}
          {reviews.length > 0 && (
            <div className="car-reviews">
              <h3>{t('review.carRating')}</h3>
              {reviews.slice(0, 5).map((r) => (
                <div key={r._id} className="review-item">
                  <span className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  {r.comment && <p>{r.comment}</p>}
                  <small>{r.fromUser?.name}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
