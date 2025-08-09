import { useEffect, useRef } from 'react';
import L from 'leaflet';

export const MapPicker = ({ latitude, longitude, onChange, height = 300 }) => {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (leafletRef.current) return; // init once
    const map = L.map(mapRef.current, { zoomControl: true }).setView([
      latitude || 37.7749,
      longitude || -122.4194
    ], 11);
    leafletRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const setMarker = (lat, lng) => {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
        markerRef.current.on('dragend', () => {
          const pos = markerRef.current.getLatLng();
          if (onChange) onChange({ latitude: pos.lat, longitude: pos.lng });
        });
      }
    };

    map.on('click', (e) => {
      setMarker(e.latlng.lat, e.latlng.lng);
      if (onChange) onChange({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    });

    if (latitude && longitude) setMarker(latitude, longitude);

    return () => {
      map.remove();
      leafletRef.current = null;
    };
  }, [latitude, longitude, onChange]);

  useEffect(() => {
    if (markerRef.current && latitude && longitude) {
      markerRef.current.setLatLng([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <div style={{ height, width: '100%', borderRadius: 12, overflow: 'hidden' }} ref={mapRef} />
  );
};