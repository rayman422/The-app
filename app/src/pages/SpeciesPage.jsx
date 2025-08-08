import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function SpeciesPage() {
  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-20">
      <div className="flex items-center text-white mb-4">
        <ChevronLeft size={24} />
        <h1 className="flex-1 text-center text-xl font-bold">Caught species</h1>
        <span className="text-gray-400 text-sm">species you've caught here.</span>
      </div>
      <button className="w-full bg-emerald-600 text-white rounded-xl py-3 font-semibold mb-6">Log your first catch</button>
      <h2 className="text-white text-xl font-bold mb-4">Species to catch nearby</h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          'Largemouth bass', 'Rainbow trout', 'Smallmouth bass', 'Brown trout',
          'Bluegill', 'Channel catfish', 'Common carp', 'Brook trout', 'Spotted bass',
          'Rock bass', 'Striped bass', 'Flathead catfish', 'Green sunfish', 'Black crappie', 'White sucker',
          'Walleye', 'Northern pike', 'Muskellunge', 'Yellow perch', 'Sauger', 'Lake trout', 'Cisco',
          'Kokanee salmon', 'Pink salmon', 'Coho salmon', 'Chinook salmon', 'Sockeye salmon', 'Cutthroat trout'
        ].map(species => (
          <div key={species} className="flex flex-col items-center bg-slate-800 rounded-xl p-2">
            <img
              src={`https://placehold.co/100x70/0e172a/ffffff?text=${species.split(' ')[0]}`}
              alt={species}
              className="rounded-lg mb-2"
            />
            <span className="text-white text-sm text-center font-medium">{species}</span>
          </div>
        ))}
      </div>
    </div>
  );
}