import { useState, useEffect, useRef } from 'react';
import './MapPicker.css';

const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-script';
const DEFAULT_CENTER = { lat: 23.8103, lng: 90.4125 }; // Dhaka, Bangladesh
const DEFAULT_ZOOM = 13;

function loadGoogleMapsScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google.maps);
      return;
    }
    const existing = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google.maps));
      return;
    }
    const script = document.createElement('script');
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
}

export default function MapPicker({ value = '', onChange, label, placeholder = 'Click on map or type address', required }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    let cancelled = false;
    loadGoogleMapsScript(apiKey)
      .then((maps) => {
        if (cancelled || !mapRef.current) return;
        const map = new maps.Map(mapRef.current, {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });

        const geocoder = new maps.Geocoder();

        map.addListener('click', (e) => {
          const latLng = e.latLng;
          if (markerRef.current) markerRef.current.setMap(null);
          markerRef.current = new maps.Marker({
            position: latLng,
            map,
            animation: maps.Animation.DROP,
          });
          map.panTo(latLng);

          geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
              const addr = results[0].formatted_address;
              setInputValue(addr);
              onChange?.(addr);
            } else {
              const str = `${latLng.lat().toFixed(6)}, ${latLng.lng().toFixed(6)}`;
              setInputValue(str);
              onChange?.(str);
            }
          });
        });

        mapInstanceRef.current = map;
        setMapReady(true);
      })
      .catch(() => setMapReady(false));

    return () => { cancelled = true; };
  }, [apiKey]);

  const handleInputChange = (e) => {
    const v = e.target.value;
    setInputValue(v);
    onChange?.(v);
  };

  if (!apiKey) {
    return (
      <div className="map-picker">
        {label && <label className="map-picker-label">{label}</label>}
        <input
          type="text"
          className="map-picker-input"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
        />
        <p className="map-picker-hint">Add VITE_GOOGLE_MAPS_API_KEY to .env to pick location on map.</p>
      </div>
    );
  }

  return (
    <div className="map-picker">
      {label && <label className="map-picker-label">{label}</label>}
      <input
        type="text"
        className="map-picker-input"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
      />
      <div
        ref={mapRef}
        className="map-picker-map"
        style={{ minHeight: mapReady ? 280 : 120 }}
      />
      {!mapReady && apiKey && <p className="map-picker-loading">Loading map…</p>}
    </div>
  );
}
