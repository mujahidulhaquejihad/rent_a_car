import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import './ReviewForm.css';

export default function ReviewForm({ bookingId, onDone }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('user_to_driver');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/reviews', { bookingId, rating, comment, type });
      setSent(true);
      setOpen(false);
      onDone?.();
    } catch (err) {
      if (err.response?.data?.message?.includes('Already')) setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) return <small className="review-done">{t('review.submitReview')} ✓</small>;

  return (
    <div className="review-form-wrap">
      <button type="button" className="btn btn-outline btn-sm" onClick={() => setOpen(!open)}>
        {t('review.rateExperience')}
      </button>
      {open && (
        <form className="review-form card" onSubmit={submit}>
          <div className="form-group">
            <label>{t('review.rating')}</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="user_to_driver">{t('review.driverRating')}</option>
              <option value="user_to_car">{t('review.carRating')}</option>
            </select>
          </div>
          <div className="form-group">
            <label>1-5 {t('review.rating')}</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} ★</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>{t('review.comment')}</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
            {loading ? t('common.loading') : t('review.submitReview')}
          </button>
        </form>
      )}
    </div>
  );
}
