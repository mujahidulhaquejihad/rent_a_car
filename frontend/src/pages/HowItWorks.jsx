import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './HowItWorks.css';

const STEPS = [
  { step: 1, key: 'search', icon: '🔍' },
  { step: 2, key: 'choose', icon: '🚗' },
  { step: 3, key: 'book', icon: '📅' },
  { step: 4, key: 'drive', icon: '🛣️' },
];

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <div className="how-page">
      <section className="how-hero">
        <div className="container">
          <h1 className="how-title">{t('howItWorks.title')}</h1>
          <p className="how-lead">{t('howItWorks.lead')}</p>
        </div>
      </section>
      <section className="how-steps">
        <div className="container">
          <ol className="how-list">
            {STEPS.map(({ step, key, icon }) => (
              <li key={step} className="how-item">
                <span className="how-item-num" aria-hidden="true">{step}</span>
                <span className="how-item-icon" aria-hidden="true">{icon}</span>
                <div className="how-item-content">
                  <h2>{t(`howItWorks.step${step}Title`)}</h2>
                  <p>{t(`howItWorks.step${step}Text`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="how-cta">
        <div className="container">
          <Link to="/cars" className="btn btn-primary btn-lg">{t('car.bookNow')}</Link>
        </div>
      </section>
    </div>
  );
}
