import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">Rent A Car</Link>
            <p className="footer-tagline">Your journey, your choice. Book a car in minutes — Body Bhara or Full Book.</p>
          </div>
          <div className="footer-col">
            <h4>Quick links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/cars">Browse cars</Link></li>
              <li><Link to="/cars?type=Sedan">Sedans</Link></li>
              <li><Link to="/cars?type=SUV">SUVs</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Car types</h4>
            <ul>
              <li><Link to="/cars?type=Sedan">{t('car.sedan')}</Link></li>
              <li><Link to="/cars?type=Micro">{t('car.micro')}</Link></li>
              <li><Link to="/cars?type=SUV">{t('car.suv')}</Link></li>
              <li><Link to="/cars?type=Premium">{t('car.premium')}</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li>support@rentacar.com</li>
              <li>+880 1XXX-XXXXXX</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {currentYear} Rent A Car. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
