import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1 className="about-title">{t('about.title')}</h1>
          <p className="about-lead">{t('about.lead')}</p>
        </div>
      </section>
      <section className="about-content">
        <div className="container about-grid">
          <div className="about-card">
            <span className="about-card-icon" aria-hidden="true">🎯</span>
            <h2>{t('about.missionTitle')}</h2>
            <p>{t('about.missionText')}</p>
          </div>
          <div className="about-card">
            <span className="about-card-icon" aria-hidden="true">✨</span>
            <h2>{t('about.valuesTitle')}</h2>
            <p>{t('about.valuesText')}</p>
          </div>
          <div className="about-card">
            <span className="about-card-icon" aria-hidden="true">🚗</span>
            <h2>{t('about.serviceTitle')}</h2>
            <p>{t('about.serviceText')}</p>
          </div>
        </div>
      </section>
      <section className="about-cta">
        <div className="container">
          <p className="about-cta-text">{t('about.ctaText')}</p>
          <Link to="/cars" className="btn btn-primary btn-lg">{t('about.ctaButton')} →</Link>
        </div>
      </section>
    </div>
  );
}
