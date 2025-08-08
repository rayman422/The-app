import React from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithCustomToken } from 'firebase/auth';

export default function SignInPage() {
  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };
  const handleToken = async () => {
    const token = window.__initial_auth_token;
    if (token) await signInWithCustomToken(auth, token);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
      <div className="max-w-md w-full p-6">
        <h1 className="text-2xl font-bold mb-2">Sign in</h1>
        <p className="text-gray-400 mb-4">Sign in to sync your catches securely.</p>
        <div className="space-y-2">
          <button onClick={handleGoogle} className="w-full bg-emerald-600 text-white rounded-xl py-2 font-semibold">Continue with Google</button>
          <button onClick={handleToken} className="w-full bg-slate-700 text-white rounded-xl py-2 font-semibold">Use custom token</button>
        </div>
      </div>
    </div>
  );
}