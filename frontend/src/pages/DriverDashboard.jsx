import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './DriverDashboard.css';

export default function DriverDashboard() {
  const { t } = useTranslation();
  return (
    <div className="container">
      <h1 className="page-title">{t('nav.driverDashboard')}</h1>
      <div className="driver-cards">
        <Link to="/driver/rides" className="card driver-card">
          <h3>{t('nav.rideRequests')}</h3>
          <p>View and accept/reject booking requests</p>
        </Link>
        <Link to="/driver/earnings" className="card driver-card">
          <h3>{t('nav.earnings')}</h3>
          <p>View completed rides and total earnings</p>
        </Link>
        <Link to="/driver/cars/new" className="card driver-card">
          <h3>{t('driver.addCar')}</h3>
          <p>Add car details and availability</p>
        </Link>
      </div>
    </div>
  );
}
