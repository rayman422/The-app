import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapPage() {
  return (
    <div className="bg-slate-900 p-4 min-h-screen text-white pb-20">
      <h1 className="text-xl font-bold mt-2 mb-3 text-center">Map</h1>
      <div className="h-96 rounded-lg overflow-hidden">
        <MapContainer center={[30.2672, -97.7431]} zoom={10} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          <Marker position={[30.2672, -97.7431]} icon={markerIcon}>
            <Popup>Sample spot</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}