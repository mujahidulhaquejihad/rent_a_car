import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { getCarImageUrl } from '../utils/imageUrl';
import './Home.css';

const TYPES = [
  { id: 'Sedan', labelKey: 'sedan', color: '#6366f1', icon: '🚗' },
  { id: 'Micro', labelKey: 'micro', color: '#14b8a6', icon: '🚙' },
  { id: 'SUV', labelKey: 'suv', color: '#f59e0b', icon: '🚐' },
  { id: 'Premium', labelKey: 'premium', color: '#ec4899', icon: '✨' },
];

const INITIAL_CARS_SHOWN = 12;
const SHOW_MORE_STEP = 12;

export default function Home() {
  const { t } = useTranslation();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCount, setShowCount] = useState(INITIAL_CARS_SHOWN);

  useEffect(() => {
    api.get('/cars').then(({ data }) => {
      if (data.success) setCars((data.cars || []).slice(0, 100));
    }).catch(() => setCars([])).finally(() => setLoading(false));
  }, []);


  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero" aria-label="Hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <span className="hero-badge">100+ cars available</span>
          <h1 className="hero-title">
            Drive your journey.<br />Rent the perfect car.
          </h1>
          <p className="hero-sub">
            {t('car.availableCars')} — Body Bhara or Full Book. Book in minutes.
          </p>
          <div className="hero-cta">
            <Link to="/cars" className="btn btn-primary btn-lg btn-glow">
              Browse all cars
            </Link>
            <Link to="/cars?type=Sedan" className="btn btn-outline btn-lg hero-cta-secondary">
              Sedans
            </Link>
          </div>
        </div>
      </section>

      {/* Car types */}
      <section className="home-section types-section" aria-label="Car types">
        <div className="container">
        <h2 className="section-title">{t('car.carTypes')}</h2>
        <p className="section-sub center">Choose your preferred category and find the right car.</p>
        <div className="type-grid">
          {TYPES.map(({ id, labelKey, color, icon }) => (
            <Link
              key={id}
              to={`/cars?type=${id}`}
              className="type-card"
              style={{ '--type-color': color }}
            >
              <span className="type-icon">{icon}</span>
              <span className="type-label">{t(`car.${labelKey}`)}</span>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* Showcase: CSS gradient — no external images */}
      <section className="home-showcase" aria-label="Fleet">
        <div className="home-showcase-bg" aria-hidden="true" />
        <div className="home-showcase-overlay" />
        <div className="container home-showcase-inner">
          <h2 className="home-showcase-title">Premium fleet at your service</h2>
          <p className="home-showcase-text">From economy to luxury — we have the right car for every trip.</p>
          <Link to="/cars" className="btn btn-primary btn-lg btn-glow">View fleet</Link>
        </div>
      </section>

      {/* Cars grid */}
      <section className="home-section cars-section" aria-label="Browse cars">
        <div className="container">
        <div className="section-header">
          <h2 className="section-title">Choose from 100 cars</h2>
          <p className="section-sub">Different types, brands, and budgets. Find yours.</p>
          <Link to="/cars" className="btn btn-outline">View all & filter →</Link>
        </div>
        {loading ? (
          <div className="cars-loading">
            <div className="loader" />
            <p>Loading cars...</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="cars-empty">
            <p>No cars yet. Run <code>npm run seed</code> in the backend folder to add 100 sample cars.</p>
            <Link to="/cars" className="btn btn-primary">Go to Cars</Link>
          </div>
        ) : (
          <>
            <div className="home-cars-grid">
              {cars.slice(0, showCount).map((car) => (
              <Link key={car._id} to={`/cars/${car._id}`} className="home-car-card card">
                <div className="home-car-image">
                  <img
                    src={getCarImageUrl(car)}
                    alt={`${car.brand} ${car.model}`}
                    loading="lazy"
                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextElementSibling?.classList.add('show'); }}
                  />
                  <div className="home-car-placeholder" aria-hidden="true">{car.brand?.[0]}</div>
                  <span className={`home-car-badge ${car.availability}`}>
                    {car.availability === 'available' ? 'Available' : car.availability}
                  </span>
                  <span className="home-car-type-pill">{car.type}</span>
                </div>
                <div className="home-car-info">
                  <h3>{car.brand} {car.model}</h3>
                  <div className="home-car-meta">
                    {car.bodyBharaPerKm != null && (
                      <span>৳{car.bodyBharaPerKm}/km</span>
                    )}
                    {car.fullBookPerDay != null && (
                      <span>৳{car.fullBookPerDay}/day</span>
                    )}
                  </div>
                  <span className="home-car-cta">View details →</span>
                </div>
              </Link>
              ))}
            </div>
            <div className="home-show-more">
              {showCount < cars.length ? (
                <button
                  type="button"
                  className="btn btn-outline btn-lg"
                  onClick={() => setShowCount((c) => Math.min(c + SHOW_MORE_STEP, cars.length))}
                >
                  Show more ({cars.length - showCount} left)
                </button>
              ) : cars.length > INITIAL_CARS_SHOWN ? (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowCount(INITIAL_CARS_SHOWN)}
                >
                  Show less
                </button>
              ) : null}
            </div>
          </>
        )}
        </div>
      </section>

      {/* CTA */}
      <section className="home-section cta-section" aria-label="Get started">
        <div className="container">
        <div className="cta-block">
          <h2>Ready to hit the road?</h2>
          <p>Register, pick a car, and book in minutes. Body Bhara or Full Book — your choice.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Get started</Link>
        </div>
        </div>
      </section>
    </div>
  );
}
