import { useState, useEffect } from 'react';
import { signInWithCustomToken, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  User,
  BarChart2,
  Fish,
  Compass,
  Plus,
  Map as MapIcon,
  CloudSun,
  GitPullRequest,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Wind,
  Thermometer,
  Moon,
  Clock,
  Waves,
  Sun,
  Sunrise,
  Sunset,
} from 'lucide-react';
import './index.css';
import { auth, db, appId } from './firebase';
import AddCatchForm from './components/AddCatchForm.jsx';
import { listCatches, recomputeUserStats } from './services/catches';

// Data for charts
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

const StatChart = ({ title, data, dataKey, tooltipContent, barColor = '#4ade80' }) => (
  <div className="w-full bg-slate-800 rounded-2xl p-4 mb-4">
    <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} content={tooltipContent} />
        <Bar dataKey={dataKey} fill={barColor} radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const StatCard = ({ icon, label, value }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-slate-800 rounded-2xl flex-1">
    {icon}
    <div className="text-white text-3xl font-bold mt-2">{value}</div>
    <div className="text-gray-400 text-sm">{label}</div>
  </div>
);

const RecentCatches = ({ items }) => (
  <div className="mt-4 space-y-3 w-full px-4">
    {items.length === 0 && (
      <div className="flex items-center space-x-4 p-4 bg-slate-800 rounded-xl">
        <img src="https://placehold.co/80x80/0e172a/94a3b8?text=fish" alt="Catch" className="rounded-lg" />
        <div className="flex-1">
          <h3 className="text-white font-semibold">Start your logbook</h3>
          <p className="text-gray-400 text-sm">Track all your catches in one place! Find and relive your fishing memories whenever you'd like.</p>
        </div>
      </div>
    )}
    {items.map((c) => (
      <div key={c.id || c.createdAt} className="flex items-center space-x-4 p-4 bg-slate-800 rounded-xl">
        <img src={`https://placehold.co/80x80/0e172a/94a3b8?text=${encodeURIComponent((c.species || 'Fish').split(' ')[0])}`} alt="Catch" className="rounded-lg" />
        <div className="flex-1 text-white">
          <div className="font-semibold">{c.species}</div>
          <div className="text-xs text-gray-400">{c.length ? `${c.length} in` : ''} {c.weight ? `• ${c.weight} lb` : ''}</div>
          {c.notes && <div className="text-xs text-gray-400 mt-1">{c.notes}</div>}
        </div>
      </div>
    ))}
  </div>
);

const UserProfile = ({ user, userId, setPage, catches, onAddedCatch }) => (
  <div className="flex flex-col items-center p-4 bg-slate-900 min-h-screen pb-20">
    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mt-8">
      <User size={64} className="text-gray-400" />
    </div>
    <h1 className="text-white text-2xl font-bold mt-4">{user.name}</h1>
    <p className="text-gray-400 text-sm">@{user.username} 🇺🇸 {user.location}</p>
    <p className="text-gray-400 text-xs mt-2 truncate max-w-[80%]">User ID: {userId}</p>
    <div className="flex justify-around w-full mt-6">
      <div className="flex flex-col items-center">
        <span className="text-white text-2xl font-bold">{user.catches}</span>
        <span className="text-gray-400">Catches</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-white text-2xl font-bold">{user.followers}</span>
        <span className="text-gray-400">Followers</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-white text-2xl font-bold">{user.following}</span>
        <span className="text-gray-400">Following</span>
      </div>
    </div>
    <div className="flex space-x-2 mt-6 w-full px-4">
      <button className="flex-1 bg-gray-700 text-white rounded-xl py-2 font-semibold">Edit</button>
      <button className="flex-1 bg-gray-700 text-white rounded-xl py-2 font-semibold">Share</button>
    </div>
    <div className="grid grid-cols-2 gap-2 mt-4 w-full px-4">
      <div onClick={() => setPage('species')} className="cursor-pointer">
        <StatCard icon={<Fish size={32} className="text-gray-400" />} label="Species" value={user.species} />
      </div>
      <div onClick={() => setPage('statistics')} className="cursor-pointer">
        <StatCard icon={<BarChart2 size={32} className="text-gray-400" />} label="Statistics" value={user.catches} />
      </div>
      <div onClick={() => setPage('gear')} className="cursor-pointer">
        <StatCard icon={<GitPullRequest size={32} className="text-gray-400" />} label="Your gear" value={user.gearCount} />
      </div>
      <StatCard icon={<Compass size={32} className="text-gray-400" />} label="Your Map" value={user.locations} />
    </div>

    <div className="w-full px-4 mt-6">
      <h2 className="text-white text-xl font-bold mb-3">Add a catch</h2>
      <AddCatchForm userId={userId} onAdded={onAddedCatch} />
    </div>

    <div className="w-full px-4 mt-6">
      <h2 className="text-white text-xl font-bold">Recent catches</h2>
      <RecentCatches items={catches} />
    </div>
  </div>
);

const Statistics = () => (
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

const SpeciesList = () => (
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

const GearList = () => {
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
    <div className="bg-slate-900 p-4 min-h-screen pb-20 text-white">
      <div className="flex items-center mb-4">
        <ChevronLeft size={24} className="cursor-pointer" />
        <h1 className="flex-1 text-center text-xl font-bold">Your Forecast</h1>
        <div className="w-6"></div>
      </div>
      <div className="flex flex-col items-center text-center mb-6">
        <h2 className="text-4xl font-bold">75°</h2>
        <p className="text-xl font-semibold">Austin, TX</p>
        <p className="text-gray-400 text-sm">Mostly Sunny</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Waves size={24} className="text-emerald-500" />
            <span className="font-semibold">Tide</span>
          </div>
          <div>
            <p className="text-sm">Low 11:22 AM</p>
            <p className="text-sm">High 5:45 PM</p>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wind size={24} className="text-emerald-500" />
            <span className="font-semibold">Wind</span>
          </div>
          <div>
            <p className="text-sm">5 mph WSW</p>
            <p className="text-sm">Gusts 10 mph</p>
          </div>
        </div>
      </div>
      <div className="bg-slate-800 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sun size={24} className="text-emerald-500" />
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
            <Moon size={32} className="text-cyan-200 mb-2" />
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
          <div key={index} className="flex-shrink-0 w-24 bg-slate-800 rounded-xl p-4 text-center">
            <p className="text-sm font-semibold mb-2">{item.time}</p>
            {item.icon}
            <p className="text-2xl font-bold mt-2">{item.temp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const BottomNavbar = ({ currentPage, setPage }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-gray-700 p-2 flex justify-around items-center">
    <button onClick={() => setPage('map')} className="flex flex-col items-center text-gray-400 p-2">
      <MapIcon size={24} className={currentPage === 'map' ? 'text-white' : ''} />
      <span className={`text-xs mt-1 ${currentPage === 'map' ? 'text-white' : ''}`}>Map</span>
    </button>
    <button onClick={() => setPage('statistics')} className="flex flex-col items-center text-gray-400 p-2">
      <BarChart2 size={24} className={currentPage === 'statistics' ? 'text-white' : ''} />
      <span className={`text-xs mt-1 ${currentPage === 'statistics' ? 'text-white' : ''}`}>Stats</span>
    </button>
    <button onClick={() => setPage('addCatch')} className="flex flex-col items-center text-gray-400 p-2">
      <Plus size={24} className={currentPage === 'addCatch' ? 'text-white' : ''} />
      <span className={`text-xs mt-1 ${currentPage === 'addCatch' ? 'text-white' : ''}`}>Add Catch</span>
    </button>
    <button onClick={() => setPage('gear')} className="flex flex-col items-center text-gray-400 p-2">
      <GitPullRequest size={24} className={currentPage === 'gear' ? 'text-white' : ''} />
      <span className={`text-xs mt-1 ${currentPage === 'gear' ? 'text-white' : ''}`}>Gear</span>
    </button>
    <button onClick={() => setPage('forecast')} className="flex flex-col items-center text-gray-400 p-2">
      <CloudSun size={24} className={currentPage === 'forecast' ? 'text-white' : ''} />
      <span className={`text-xs mt-1 ${currentPage === 'forecast' ? 'text-white' : ''}`}>Forecast</span>
    </button>
    <button onClick={() => setPage('profile')} className="flex flex-col items-center text-gray-400 p-2">
      <User size={24} className={currentPage === 'profile' ? 'text-white' : ''} />
      <span className={`text-xs mt-1 ${currentPage === 'profile' ? 'text-white' : ''}`}>You</span>
    </button>
  </div>
);

const MapPage = ({ setPage }) => (
  <div className="bg-slate-900 p-4 min-h-screen text-white text-center pb-20">
    <h1 className="text-xl font-bold mt-8">Map</h1>
    <p className="mt-4">Map view placeholder.</p>
    <button onClick={() => setPage('profile')} className="mt-6 bg-emerald-600 text-white rounded-xl py-2 px-6 font-semibold">
      Back to Profile
    </button>
  </div>
);

const ConfigError = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white p-6">
    <div className="max-w-md text-center">
      <h1 className="text-2xl font-bold mb-2">Configuration required</h1>
      <p className="text-gray-400">Missing Firebase environment variables. Copy .env.example to .env and fill in your Firebase web app credentials.</p>
    </div>
  </div>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState('profile');
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [recentCatches, setRecentCatches] = useState([]);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Hard require Firebase
  const isConfigReady = !!db && !!auth;

  useEffect(() => {
    if (!isConfigReady) return;

    const token = window.__initial_auth_token;
    const signIn = async () => {
      try {
        if (token) {
          await signInWithCustomToken(auth, token);
        } else {
          setShowAuthPrompt(true);
        }
      } catch (error) {
        console.error('Firebase custom sign-in failed:', error);
        setShowAuthPrompt(true);
      }
    };
    signIn();

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const currentUserId = authUser.uid;
        setUserId(currentUserId);
        setIsAuthReady(true);

        const userDocRef = doc(db, 'artifacts', appId, 'users', currentUserId, 'userProfile', 'profile');
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          const defaultUser = {
            name: authUser.displayName || 'New Angler',
            username: authUser.displayName?.toLowerCase().replace(/\s+/g, '') || 'angler',
            location: 'Unknown',
            catches: 0,
            followers: 0,
            following: 0,
            species: 0,
            gearCount: 0,
            locations: 0,
          };
          await setDoc(userDocRef, defaultUser);
          setUser(defaultUser);
        }
        listCatches(currentUserId).then(setRecentCatches);
      } else {
        setIsAuthReady(false);
        setUser(null);
        setUserId(null);
        setRecentCatches([]);
      }
    });

    return () => unsubscribe();
  }, [isConfigReady]);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setShowAuthPrompt(false);
    } catch (e) {
      console.error('Google sign-in failed', e);
    }
  };

  const onCatchAdded = async () => {
    if (!userId) return;
    await listCatches(userId).then(setRecentCatches);
    await recomputeUserStats(userId);
    // Refresh profile numbers
    const userDocRef = doc(db, 'artifacts', appId, 'users', userId, 'userProfile', 'profile');
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) setUser(userDoc.data());
  };

  const renderPage = () => {
    if (!isConfigReady) return <ConfigError />;

    if (showAuthPrompt && !userId) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
          <div className="max-w-md w-full p-6">
            <h1 className="text-2xl font-bold mb-2">Sign in</h1>
            <p className="text-gray-400 mb-4">Sign in with Google to sync your catches securely.</p>
            <button onClick={handleGoogleSignIn} className="w-full bg-emerald-600 text-white rounded-xl py-2 font-semibold">Continue with Google</button>
          </div>
        </div>
      );
    }

    if (!isAuthReady || !user) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
          <div className="text-white text-lg">Loading...</div>
        </div>
      );
    }

    switch (currentPage) {
      case 'profile':
        return <UserProfile user={user} userId={userId} setPage={setCurrentPage} catches={recentCatches} onAddedCatch={onCatchAdded} />;
      case 'statistics':
        return <Statistics />;
      case 'species':
        return <SpeciesList />;
      case 'gear':
        return <GearList />;
      case 'forecast':
        return <Forecast />;
      case 'map':
        return <MapPage setPage={setCurrentPage} />;
      case 'addCatch':
        return (
          <div className="bg-slate-900 p-4 min-h-screen text-white text-center pb-20">
            <h1 className="text-xl font-bold mt-8">Add a Catch</h1>
            <div className="max-w-md mx-auto text-left mt-4">
              <AddCatchForm userId={userId} onAdded={onCatchAdded} />
            </div>
            <button onClick={() => setCurrentPage('profile')} className="mt-6 bg-emerald-600 text-white rounded-xl py-2 px-6 font-semibold">
              Back to Profile
            </button>
          </div>
        );
      default:
        return <UserProfile user={user} userId={userId} setPage={setCurrentPage} catches={recentCatches} onAddedCatch={onCatchAdded} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <style>{`
        body { background-color: #0f172a; font-family: 'Inter', sans-serif; }
      `}</style>
      <div className="max-w-md mx-auto">
        {renderPage()}
        <BottomNavbar currentPage={currentPage} setPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default App;
