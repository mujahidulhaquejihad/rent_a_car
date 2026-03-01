import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Contact.css';

export default function Contact() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <h1 className="contact-title">{t('contact.title')}</h1>
          <p className="contact-lead">{t('contact.lead')}</p>
        </div>
      </section>
      <section className="contact-content">
        <div className="container contact-grid">
          <div className="contact-info">
            <h2>{t('contact.infoTitle')}</h2>
            <ul className="contact-details">
              <li>
                <strong>Email</strong>
                <a href="mailto:support@rentacar.com">support@rentacar.com</a>
              </li>
              <li>
                <strong>Phone</strong>
                <a href="tel:+8801XXX-XXXXXX">+880 1XXX-XXXXXX</a>
              </li>
              <li>
                <strong>{t('contact.hours')}</strong>
                <span>9:00 AM – 8:00 PM (BST)</span>
              </li>
            </ul>
          </div>
          <div className="contact-form-wrap">
            <h2>{t('contact.formTitle')}</h2>
            {sent ? (
              <p className="contact-success">{t('contact.success')}</p>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <label>
                  <span>{t('auth.name')}</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  <span>{t('auth.email')}</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  <span>{t('contact.subject')}</span>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  <span>{t('contact.message')}</span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </label>
                <button type="submit" className="btn btn-primary">{t('common.submit')}</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
