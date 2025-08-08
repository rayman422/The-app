import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function MapPage() {
  return (
    <div className="bg-slate-900 p-4 min-h-screen text-white pb-20">
      <h1 className="text-xl font-bold mt-2 mb-3 text-center">Map</h1>
      <div className="h-96 rounded-lg overflow-hidden">
        <MapContainer center={[30.2672, -97.7431]} zoom={10} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          <Marker position={[30.2672, -97.7431]}>
            <Popup>Sample spot</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}