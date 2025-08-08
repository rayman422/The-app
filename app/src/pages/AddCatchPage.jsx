import React, { useEffect, useState } from 'react';
import AddCatchForm from '../components/AddCatchForm.jsx';
import { auth } from '../firebase';

export default function AddCatchPage() {
  const [userId, setUserId] = useState(null);
  useEffect(() => auth.onAuthStateChanged((u) => setUserId(u?.uid || null)), []);

  if (!userId) return <div className="flex items-center justify-center min-h-screen text-white">Loading…</div>;
  return (
    <div className="bg-slate-900 p-4 min-h-screen text-white text-center pb-20">
      <h1 className="text-xl font-bold mt-8">Add a Catch</h1>
      <div className="max-w-md mx-auto text-left mt-4">
        <AddCatchForm userId={userId} onAdded={() => { /* toast or message could go here */ }} />
      </div>
    </div>
  );
}