import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function GearPage() {
  const gearItems = [
    { name: 'Spinning Rod', brand: 'Shimano', type: 'Rod', image: 'https://placehold.co/100x70/0e172a/ffffff?text=Rod' },
    { name: 'Baitcaster Reel', brand: 'Daiwa', type: 'Reel', image: 'https://placehold.co/100x70/0e172a/ffffff?text=Reel' },
    { name: 'Jerkbait', brand: 'Rapala', type: 'Lure', image: 'https://placehold.co/100x70/0e172a/ffffff?text=Lure' },
    { name: 'Braided Line', brand: 'PowerPro', type: 'Line', image: 'https://placehold.co/100x70/0e172a/ffffff?text=Line' },
    { name: 'Tackle Box', brand: 'Plano', type: 'Storage', image: 'https://placehold.co/100x70/0e172a/ffffff?text=Box' },
    { name: 'Fishing Pliers', brand: 'KastKing', type: 'Tool', image: 'https://placehold.co/100x70/0e172a/ffffff?text=Pliers' },
    { name: 'Wading Boots', brand: 'Simms', type: 'Apparel', image: 'https://placehold.co/100x70/0e172a/ffffff?text=Boots' },
    { name: 'Fly Rod', brand: 'Orvis', type: 'Rod', image: 'https://placehold.co/100x70/0e172a/ffffff?text=FlyRod' },
    { name: 'Fly Reel', brand: 'Redington', type: 'Reel', image: 'https://placehold.co/100x70/0e172a/ffffff?text=FlyReel' },
    { name: 'Fly Assortment', brand: 'Umpqua', type: 'Lure', image: 'https://placehold.co/100x70/0e172a/ffffff?text=Flies' },
    { name: 'Net', brand: 'Frabill', type: 'Accessory', image: 'https://placehold.co/100x70/0e172a/ffffff?text=Net' },
    { name: 'Scale', brand: 'Rapala', type: 'Tool', image: 'https://placehold.co/100x70/0e172a/ffffff?text=Scale' },
  ];

  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-20">
      <div className="flex items-center text-white mb-4">
        <ChevronLeft size={24} />
        <h1 className="flex-1 text-center text-xl font-bold">Your Gear</h1>
        <button className="bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-full">Add gear</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {gearItems.map((item, index) => (
          <div key={index} className="bg-slate-800 rounded-xl p-4 flex flex-col items-center text-center">
            <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg mb-2" />
            <h3 className="text-white font-semibold">{item.name}</h3>
            <p className="text-gray-400 text-sm">{item.brand}</p>
          </div>
        ))}
      </div>
    </div>
  );
}