import React from 'react';
import AddCatchForm from '../components/AddCatchForm.jsx';
import useAuth from '../auth/useAuth.js';

export default function AddCatchPage() {
  const { user } = useAuth();
  if (!user) return <div className="flex items-center justify-center min-h-screen text-white">Loading…</div>;
  return (
    <div className="bg-slate-900 p-4 min-h-screen text-white text-center pb-20">
      <h1 className="text-xl font-bold mt-8">Add a Catch</h1>
      <div className="max-w-md mx-auto text-left mt-4">
        <AddCatchForm userId={user.uid} onAdded={() => {}} />
      </div>
    </div>
  );
}