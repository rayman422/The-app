import React from 'react';
import { Sun, CloudSun, Thermometer, Moon, ChevronLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const StatChart = ({ title, data, dataKey, barColor = '#4ade80' }) => (
  <div className="w-full bg-slate-800 rounded-2xl p-4 mb-4">
    <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} />
        <Bar dataKey={dataKey} fill={barColor} radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const monthlyCatches = [
  { name: 'J', catches: 5 }, { name: 'F', catches: 8 }, { name: 'M', catches: 10 },
  { name: 'A', catches: 12 }, { name: 'M', catches: 15 }, { name: 'J', catches: 20 },
  { name: 'J', catches: 25 }, { name: 'A', catches: 22 }, { name: 'S', catches: 18 },
  { name: 'O', catches: 14 }, { name: 'N', catches: 10 }, { name: 'D', catches: 6 },
];
const timeOfDayCatches = [
  { name: 'Midnight', catches: 3 }, { name: '4am', catches: 5 }, { name: '8am', catches: 10 },
  { name: '12pm', catches: 25 }, { name: '4pm', catches: 20 }, { name: '8pm', catches: 15 }, { name: '12am', catches: 5 },
];
const moonPhaseCatches = [
  { name: 'New Moon', catches: 8 }, { name: 'Waxing Crescent', catches: 15 }, { name: 'First Quarter', catches: 20 },
  { name: 'Waxing Gibbous', catches: 22 }, { name: 'Full Moon', catches: 30 }, { name: 'Waning Gibbous', catches: 25 },
  { name: 'Last Quarter', catches: 18 }, { name: 'Waning Crescent', catches: 12 },
];
const airTempCatches = [
  { name: '30s', catches: 2 }, { name: '40s', catches: 5 }, { name: '50s', catches: 8 },
  { name: '60s', catches: 12 }, { name: '70s', catches: 18 }, { name: '80s', catches: 25 },
  { name: '90s', catches: 20 }, { name: '100s', catches: 10 },
];
const windSpeedCatches = [
  { name: '0-5mph', catches: 25 }, { name: '5-10mph', catches: 20 }, { name: '10-15mph', catches: 15 },
  { name: '15-20mph', catches: 10 }, { name: '20-25mph', catches: 5 }, { name: '25-30mph', catches: 2 },
];
const airPressureCatches = [
  { name: '980hPa', catches: 5 }, { name: '990hPa', catches: 8 }, { name: '1000hPa', catches: 12 },
  { name: '1010hPa', catches: 25 }, { name: '1020hPa', catches: 20 }, { name: '1030hPa', catches: 15 },
];

export default function StatisticsPage() {
  return (
    <div className="bg-slate-900 p-4 min-h-screen pb-20">
      <div className="flex items-center text-white mb-4">
        <ChevronLeft size={24} />
        <h1 className="flex-1 text-center text-xl font-bold">Your statistics</h1>
        <span className="text-gray-400">Only visible to you</span>
      </div>
      <div className="bg-emerald-600 rounded-2xl p-4 mb-4 flex justify-center items-center">
        <button className="flex items-center bg-white text-emerald-600 rounded-full px-4 py-2 font-semibold">
          Upgrade to Pro
        </button>
      </div>
      <div className="w-full">
        <h2 className="text-white text-xl font-bold mb-4">When you are successful</h2>
        <div className="flex justify-around mb-4">
          <div className="flex flex-col items-center text-gray-400 text-sm">
            <Sun size={32} />
            <span className="mt-1">Noon</span>
          </div>
          <div className="flex flex-col items-center text-gray-400 text-sm">
            <CloudSun size={32} />
            <span className="mt-1">Sun behind Clouds</span>
          </div>
          <div className="flex flex-col items-center text-gray-400 text-sm">
            <Thermometer size={32} />
            <span className="mt-1">Water temp 60-65°</span>
          </div>
          <div className="flex flex-col items-center text-gray-400 text-sm">
            <Moon size={32} />
            <span className="mt-1">Moon phase Waxing Crescent</span>
          </div>
        </div>
      </div>
      <StatChart title="Catches by month" data={monthlyCatches} dataKey="catches" />
      <StatChart title="Catches by time of day" data={timeOfDayCatches} dataKey="catches" />
      <StatChart title="Catches by moon phase" data={moonPhaseCatches} dataKey="catches" />
      <StatChart title="Catches by air temperature" data={airTempCatches} dataKey="catches" />
      <StatChart title="Catches by wind speed" data={windSpeedCatches} dataKey="catches" />
      <StatChart title="Catches by air pressure" data={airPressureCatches} dataKey="catches" />
    </div>
  );
}