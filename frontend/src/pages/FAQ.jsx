import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './FAQ.css';

const FAQ_KEYS = [
  'whatIsBodyBhara',
  'whatIsFullBook',
  'howToCancel',
  'driverIncluded',
  'paymentMethods',
  'bookingTime',
];

export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq-page">
      <section className="faq-hero">
        <div className="container">
          <h1 className="faq-title">{t('faq.title')}</h1>
          <p className="faq-lead">{t('faq.lead')}</p>
        </div>
      </section>
      <section className="faq-content">
        <div className="container faq-inner">
          <ul className="faq-list">
            {FAQ_KEYS.map((key, index) => (
              <li key={key} className="faq-item">
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  aria-expanded={openIndex === index}
                >
                  {t(`faq.${key}Q`)}
                  <span className="faq-icon" aria-hidden="true">{openIndex === index ? '−' : '+'}</span>
                </button>
                {openIndex === index && (
                  <div className="faq-answer">
                    <p>{t(`faq.${key}A`)}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <p className="faq-more">
            {t('faq.more')} <Link to="/contact">{t('nav.contact')}</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
