import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Fish,
  Thermometer,
  Wind,
  Eye,
  BarChart3,
  MapPin,
  Clock,
  Target,
  Activity,
  TrendingUp,
  Waves,
  Sun,
  Moon,
  CloudSun,
  Camera,
  Plus,
  Settings,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  GitPullRequest,
  Sunrise,
  Sunset
} from 'lucide-react';
import { useAuth } from '../Auth/AuthWrapper';

// Data for charts from first model
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

const currentConditions = {
  temp: 72,
  feelsLike: 75,
  wind: { speed: 8, direction: 'NE' },
  pressure: 1022,
  humidity: 65,
  visibility: 10,
  uvIndex: 6,
  waterTemp: 68,
  cloudCover: 25
};
const biteTimePrediction = [
  { time: '6:00 AM', rating: 9, activity: 'Excellent' },
  { time: '7:00 AM', rating: 8, activity: 'Very Good' },
  { time: '12:00 PM', rating: 6, activity: 'Good' },
  { time: '6:00 PM', rating: 9, activity: 'Excellent' },
  { time: '7:00 PM', rating: 7, activity: 'Good' }
];

const fishSpecies = [
  { name: 'Largemouth Bass', catches: 2847, optimal: 'Dawn/Dusk', temp: '68-78°F', image: '🐟' },
  { name: 'Rainbow Trout', catches: 1923, optimal: 'Morning', temp: '50-65°F', image: '🐠' },
  { name: 'Smallmouth Bass', catches: 1654, optimal: 'Evening', temp: '65-75°F', image: '🐟' },
  { name: 'Brown Trout', catches: 1287, optimal: 'Overcast', temp: '55-68°F', image: '🐠' },
  { name: 'Channel Catfish', catches: 956, optimal: 'Night', temp: '70-85°F', image: '🐟' },
  { name: 'Bluegill', catches: 823, optimal: 'Midday', temp: '65-80°F', image: '🐠' }
];

const StatCard = ({ icon, label, value }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-2xl flex-1 shadow-sm">
    {icon}
    <div className="text-gray-900 text-3xl font-bold mt-2">{value}</div>
    <div className="text-gray-500 text-sm">{label}</div>
  </div>
);

const StatChart = ({ title, data, dataKey, barColor }) => (
  <div className="w-full bg-white rounded-2xl p-4 mb-4 shadow-lg">
    <h3 className="text-gray-900 text-lg font-semibold mb-2">{title}</h3>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip cursor={{ fill: 'rgba(243,244,246,0.5)' }} />
        <Bar dataKey={dataKey} fill={barColor} radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const UserProfile = ({ user, userId, setSubPage }) => (
  <div className="flex flex-col items-center p-4 bg-gray-50 min-h-screen pb-20">
    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mt-8">
      <User size={64} className="text-gray-400" />
    </div>
    <h1 className="text-gray-900 text-2xl font-bold mt-4">{user?.name || 'Angler'}</h1>
    <p className="text-gray-500 text-sm">@{user?.username || 'angler'} 🇺🇸 {user?.location || ''}</p>
    <p className="text-gray-500 text-xs mt-2 truncate max-w-[80%]">User ID: {userId}</p>
    <div className="flex justify-around w-full mt-6">
      <div className="flex flex-col items-center">
        <span className="text-gray-900 text-2xl font-bold">{user?.catches ?? 0}</span>
        <span className="text-gray-500">Catches</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-gray-900 text-2xl font-bold">{user?.followers ?? 0}</span>
        <span className="text-gray-500">Followers</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-gray-900 text-2xl font-bold">{user?.following ?? 0}</span>
        <span className="text-gray-500">Following</span>
      </div>
    </div>
    <div className="flex space-x-2 mt-6 w-full px-4">
      <button className="flex-1 bg-gray-200 text-gray-800 rounded-xl py-2 font-semibold">Edit</button>
      <button className="flex-1 bg-gray-200 text-gray-800 rounded-xl py-2 font-semibold">Share</button>
    </div>
  </div>
);

const GearList = () => {
  const gearItems = [
    { name: 'Spinning Rod', brand: 'Shimano', type: 'Rod', image: 'https://placehold.co/100x70/e5e7eb/6b7280?text=Rod' },
    { name: 'Baitcaster Reel', brand: 'Daiwa', type: 'Reel', image: 'https://placehold.co/100x70/e5e7eb/6b7280?text=Reel' },
    { name: 'Jerkbait', brand: 'Rapala', type: 'Lure', image: 'https://placehold.co/100x70/e5e7eb/6b7280?text=Lure' },
    { name: 'Braided Line', brand: 'PowerPro', type: 'Line', image: 'https://placehold.co/100x70/e5e7eb/6b7280?text=Line' },
    { name: 'Tackle Box', brand: 'Plano', type: 'Storage', image: 'https://placehold.co/100x70/e5e7eb/6b7280?text=Box' },
    { name: 'Fishing Pliers', brand: 'KastKing', type: 'Tool', image: 'https://placehold.co/100x70/e5e7eb/6b7280?text=Pliers' },
  ];

  return (
    <div className="bg-gray-50 p-4 min-h-screen pb-20">
      <div className="flex items-center text-gray-900 mb-4">
        <ChevronLeft size={24} className="cursor-pointer" />
        <h1 className="flex-1 text-center text-xl font-bold">Your Gear</h1>
        <button className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full">Add gear</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {gearItems.map((item, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-lg flex flex-col items-center text-center">
            <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg mb-2" />
            <h3 className="text-gray-900 font-semibold">{item.name}</h3>
            <p className="text-gray-500 text-sm">{item.brand}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Forecast = () => {
  const hourlyForecast = [
    { time: '11am', temp: '75°', icon: <Sun size={24} /> },
    { time: '12pm', temp: '78°', icon: <Sun size={24} /> },
    { time: '1pm', temp: '80°', icon: <Sun size={24} /> },
    { time: '2pm', temp: '81°', icon: <CloudSun size={24} /> },
    { time: '3pm', temp: '80°', icon: <CloudSun size={24} /> },
    { time: '4pm', temp: '78°', icon: <CloudSun size={24} /> },
    { time: '5pm', temp: '75°', icon: <CloudSun size={24} /> },
    { time: '6pm', temp: '72°', icon: <CloudSun size={24} /> },
    { time: '7pm', temp: '70°', icon: <CloudSun size={24} /> },
    { time: '8pm', temp: '68°', icon: <Moon size={24} /> },
  ];
  return (
    <div className="bg-gray-50 p-4 min-h-screen pb-20 text-gray-900">
      <div className="flex items-center mb-4">
        <ChevronLeft size={24} className="cursor-pointer" />
        <h1 className="flex-1 text-center text-xl font-bold">Your Forecast</h1>
        <div className="w-6"></div>
      </div>
      <div className="flex flex-col items-center text-center mb-6">
        <h2 className="text-4xl font-bold">75°</h2>
        <p className="text-xl font-semibold">Austin, TX</p>
        <p className="text-gray-500 text-sm">Mostly Sunny</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Waves size={24} className="text-blue-600" />
            <span className="font-semibold">Tide</span>
          </div>
          <div>
            <p className="text-sm">Low 11:22 AM</p>
            <p className="text-sm">High 5:45 PM</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wind size={24} className="text-blue-600" />
            <span className="font-semibold">Wind</span>
          </div>
          <div>
            <p className="text-sm">5 mph WSW</p>
            <p className="text-sm">Gusts 10 mph</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sun size={24} className="text-blue-600" />
            <span className="font-semibold">Sunrise & Sunset</span>
          </div>
          <ChevronRight size={20} />
        </div>
        <div className="flex justify-between text-center">
          <div className="flex flex-col items-center">
            <Sunrise size={32} className="text-amber-400 mb-2" />
            <p>6:02 AM</p>
          </div>
          <div className="flex flex-col items-center">
            <Moon size={32} className="text-gray-500 mb-2" />
            <p>Waxing Crescent</p>
          </div>
          <div className="flex flex-col items-center">
            <Sunset size={32} className="text-orange-400 mb-2" />
            <p>8:15 PM</p>
          </div>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-4">Hourly Forecast</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {hourlyForecast.map((item, index) => (
          <div key={index} className="flex-shrink-0 w-24 bg-white rounded-xl p-4 text-center shadow-lg">
            <p className="text-sm font-semibold mb-2">{item.time}</p>
            {item.icon}
            <p className="text-2xl font-bold mt-2">{item.temp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardView = ({ user, userId, setSubPage }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium mb-1">Current Location</h3>
          <p className="text-blue-200 text-sm">Lake Hartwell, GA</p>
        </div>
        <MapPin className="w-5 h-5 text-blue-200" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
          <p className="text-2xl font-bold">{currentConditions.temp}°F</p>
          <p className="text-blue-200 text-sm">Feels {currentConditions.feelsLike}°</p>
        </div>
        <div className="text-center">
          <Wind className="w-8 h-8 mx-auto mb-2" />
          <p className="text-2xl font-bold">{currentConditions.wind.speed}</p>
          <p className="text-blue-200 text-sm">{currentConditions.wind.direction} mph</p>
        </div>
        <div className="text-center">
          <Activity className="w-8 h-8 mx-auto mb-2" />
          <p className="text-2xl font-bold">{currentConditions.pressure}</p>
          <p className="text-blue-200 text-sm">hPa</p>
        </div>
      </div>
    </div>
    {user && (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={24} className="text-gray-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.catches} catches logged</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div onClick={() => setSubPage('profile')} className="cursor-pointer">
            <StatCard icon={<User size={32} className="text-gray-400" />} label="Profile" value={user.followers} />
          </div>
          <div onClick={() => setSubPage('gear')} className="cursor-pointer">
            <StatCard icon={<GitPullRequest size={32} className="text-gray-400" />} label="Gear" value={user.gearCount} />
          </div>
          <div onClick={() => setSubPage('forecast')} className="cursor-pointer">
            <StatCard icon={<CloudSun size={32} className="text-gray-400" />} label="Forecast" value={currentConditions.temp + '°'} />
          </div>
        </div>
      </div>
    )}
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Today's Bite Times</h3>
        <Clock className="w-5 h-5 text-gray-500" />
      </div>
      <div className="space-y-3">
        {biteTimePrediction.map((bite, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-800">{bite.time}</span>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-4 mx-0.5 rounded-sm ${
                      i < bite.rating ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">{bite.activity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SpeciesView = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-900">Local Species</h2>
      <div className="flex space-x-2">
        <button className="p-2 bg-gray-100 rounded-lg">
          <Search className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 bg-gray-100 rounded-lg">
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
    <div className="grid gap-4">
      {fishSpecies.map((species, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                {species.image}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{species.name}</h3>
                <p className="text-sm text-gray-500">{species.catches.toLocaleString()} catches reported</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {species.optimal}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {species.temp}
                  </span>
                </div>
              </div>
            </div>
            <Target className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LogbookView = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-900">My Catches</h2>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
        <Plus className="w-4 h-4" />
        <span>Log Catch</span>
      </button>
    </div>
    <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
      <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Fishing Log</h3>
      <p className="text-gray-600 mb-6">Track your catches with photos, location, weather, and gear used</p>
      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
        Log Your First Catch
      </button>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-4 shadow-lg text-center">
        <p className="text-2xl font-bold text-blue-600">0</p>
        <p className="text-sm text-gray-500">Total Catches</p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-lg text-center">
        <p className="text-2xl font-bold text-green-600">0</p>
        <p className="text-sm text-gray-500">Species</p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-lg text-center">
        <p className="text-2xl font-bold text-purple-600">0</p>
        <p className="text-sm text-gray-500">Locations</p>
      </div>
    </div>
  </div>
);

const AnalyticsView = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-gray-900">Fishing Analytics</h2>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Water Temp</p>
            <p className="text-2xl font-bold text-blue-600">{currentConditions.waterTemp}°F</p>
          </div>
          <Thermometer className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Visibility</p>
            <p className="text-2xl font-bold text-green-600">{currentConditions.visibility} mi</p>
          </div>
          <Eye className="w-8 h-8 text-green-600" />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-2xl p-6 mb-4 shadow-lg">
      <h3 className="text-gray-900 text-lg font-semibold mb-2">Monthly Catches</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={monthlyCatches}>
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip cursor={{ fill: 'rgba(243,244,246,0.5)' }} />
          <Bar dataKey="catches" fill="#3b82f6" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <StatChart title="Catches by time of day" data={timeOfDayCatches} dataKey="catches" barColor="#3b82f6" />
    <StatChart title="Catches by moon phase" data={moonPhaseCatches} dataKey="catches" barColor="#3b82f6" />
    <StatChart title="Catches by air temperature" data={airTempCatches} dataKey="catches" barColor="#3b82f6" />
    <StatChart title="Catches by wind speed" data={windSpeedCatches} dataKey="catches" barColor="#3b82f6" />
  </div>
);

export const FishProDemo = () => {
  const { user, userId, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subPage, setSubPage] = useState(null);

  const renderContent = () => {
    if (isLoading || !user) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-gray-900 text-lg">Loading...</div>
        </div>
      );
    }
    if (subPage === 'profile') {
      return <UserProfile user={user} userId={userId} setSubPage={setSubPage} />;
    }
    if (subPage === 'gear') {
      return <GearList />;
    }
    if (subPage === 'forecast') {
      return <Forecast />;
    }
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView user={user} userId={userId} setSubPage={setSubPage} />;
      case 'species':
        return <SpeciesView />;
      case 'logbook':
        return <LogbookView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <DashboardView user={user} userId={userId} setSubPage={setSubPage} />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen font-sans">
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          {subPage ? (
            <ChevronLeft className="w-6 h-6 text-gray-600 cursor-pointer" onClick={() => setSubPage(null)} />
          ) : (
            <h1 className="text-xl font-bold text-gray-900">FishPro</h1>
          )}
          <Settings className="w-6 h-6 text-gray-600 ml-auto" />
        </div>
      </div>
      <div className="px-6 py-6 pb-20">
        {renderContent()}
      </div>
      {!subPage && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
          <div className="grid grid-cols-4 gap-1 p-2">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
              { id: 'species', icon: Fish, label: 'Species' },
              { id: 'logbook', icon: Plus, label: 'Logbook' },
              { id: 'analytics', icon: TrendingUp, label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};