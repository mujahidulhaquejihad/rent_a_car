/**
 * Full URL for car/images. Relative paths (e.g. /uploads/xxx) get API origin so they load.
 */
const API_BASE = import.meta.env.VITE_API_URL || '';

export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  /* Local car pictures in public/carpictures are served by the frontend */
  if (path.startsWith('/carpictures/')) return path;
  const base = API_BASE.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

/** All local car pictures (public/carpictures) – every car uses one of these */
export const CAR_PICTURES = [
  '/carpictures/pexels-mikebirdy-136872.jpg',
  '/carpictures/pexels-bertellifotografia-3007436.jpg',
  '/carpictures/pexels-christian-9-454702-1164778.jpg',
  '/carpictures/pexels-svjae-3764984.jpg',
  '/carpictures/pexels-mikebirdy-170811.jpg',
  '/carpictures/pexels-mikebirdy-112460.jpg',
  '/carpictures/pexels-pixabay-163213.jpg',
  '/carpictures/pexels-vladalex94-1402787.jpg',
  '/carpictures/pexels-mikebirdy-120049.jpg',
  '/carpictures/pexels-mikebirdy-116675.jpg',
  '/carpictures/pexels-pixabay-210019.jpg',
  '/carpictures/pexels-georgesultan-1410013.jpg',
  '/carpictures/pexels-prime-cinematics-1005175-2036544.jpg',
];

/** Pick a local car image for a car (same car = same image). Use imageIndex for gallery (0, 1, 2...). */
export function getCarImageUrl(car, imageIndex = 0) {
  if (!car) return CAR_PICTURES[0];
  const id = (car._id || car.id || '').toString();
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash) + id.charCodeAt(i);
  const idx = Math.abs(hash + imageIndex) % CAR_PICTURES.length;
  return CAR_PICTURES[idx];
}

/** Data URI placeholder when image fails to load */
export const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e2e8f0' width='400' height='300'/%3E%3Ctext fill='%2394a3b8' font-size='16' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3ENo image%3C/text%3E%3C/svg%3E";
