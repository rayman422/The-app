import React, { useEffect, useState } from 'react';
import { User, BarChart2, Fish, GitPullRequest, Compass } from 'lucide-react';
import { auth, db, appId } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import AddCatchForm from '../components/AddCatchForm.jsx';
import { listCatches } from '../services/catches';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [catches, setCatches] = useState([]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUserId(u.uid);
        const ref = doc(db, 'artifacts', appId, 'users', u.uid, 'userProfile', 'profile');
        const snap = await getDoc(ref);
        if (snap.exists()) setUser(snap.data());
        listCatches(u.uid).then(setCatches);
      }
    });
    return () => unsub();
  }, []);

  if (!user) return <div className="flex items-center justify-center min-h-screen text-white">Loading…</div>;

  return (
    <div className="flex flex-col items-center p-4 bg-slate-900 min-h-screen pb-20">
      <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mt-8">
        <User size={64} className="text-gray-400" />
      </div>
      <h1 className="text-white text-2xl font-bold mt-4">{user.name}</h1>
      <p className="text-gray-400 text-sm">@{user.username} 🇺🇸 {user.location}</p>
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
      <div className="grid grid-cols-2 gap-2 mt-4 w-full px-4">
        <div className="cursor-pointer">
          <div className="flex flex-col items-center justify-center p-4 bg-slate-800 rounded-2xl">
            <Fish size={32} className="text-gray-400" />
            <div className="text-white text-3xl font-bold mt-2">{user.species}</div>
            <div className="text-gray-400 text-sm">Species</div>
          </div>
        </div>
        <div className="cursor-pointer">
          <div className="flex flex-col items-center justify-center p-4 bg-slate-800 rounded-2xl">
            <BarChart2 size={32} className="text-gray-400" />
            <div className="text-white text-3xl font-bold mt-2">{user.catches}</div>
            <div className="text-gray-400 text-sm">Statistics</div>
          </div>
        </div>
        <div className="cursor-pointer">
          <div className="flex flex-col items-center justify-center p-4 bg-slate-800 rounded-2xl">
            <GitPullRequest size={32} className="text-gray-400" />
            <div className="text-white text-3xl font-bold mt-2">{user.gearCount}</div>
            <div className="text-gray-400 text-sm">Your gear</div>
          </div>
        </div>
        <div className="cursor-pointer">
          <div className="flex flex-col items-center justify-center p-4 bg-slate-800 rounded-2xl">
            <Compass size={32} className="text-gray-400" />
            <div className="text-white text-3xl font-bold mt-2">{user.locations}</div>
            <div className="text-gray-400 text-sm">Your Map</div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 mt-6">
        <h2 className="text-white text-xl font-bold mb-3">Add a catch</h2>
        <AddCatchForm userId={userId} onAdded={() => listCatches(userId).then(setCatches)} />
      </div>

      <div className="w-full px-4 mt-6">
        <h2 className="text-white text-xl font-bold">Recent catches</h2>
        <div className="mt-4 space-y-3">
          {catches.map((c) => (
            <div key={c.id || c.createdAt} className="flex items-center space-x-4 p-4 bg-slate-800 rounded-xl">
              <img src={`https://placehold.co/80x80/0e172a/94a3b8?text=${encodeURIComponent((c.species || 'Fish').split(' ')[0])}`} alt="Catch" className="rounded-lg" />
              <div className="flex-1 text-white">
                <div className="font-semibold">{c.species}</div>
                <div className="text-xs text-gray-400">{c.length ? `${c.length} in` : ''} {c.weight ? `• ${c.weight} lb` : ''}</div>
                {c.notes && <div className="text-xs text-gray-400 mt-1">{c.notes}</div>}
              </div>
            </div>
          ))}
          {catches.length === 0 && (
            <div className="flex items-center space-x-4 p-4 bg-slate-800 rounded-xl">
              <img src="https://placehold.co/80x80/0e172a/94a3b8?text=fish" alt="Catch" className="rounded-lg" />
              <div className="flex-1">
                <h3 className="text-white font-semibold">Start your logbook</h3>
                <p className="text-gray-400 text-sm">Track all your catches in one place! Find and relive your fishing memories whenever you'd like.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}