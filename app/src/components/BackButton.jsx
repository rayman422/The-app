import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function BackButton({ label = 'Back' }) {
  const navigate = useNavigate();
  return (
    <button aria-label="Go back" onClick={() => navigate(-1)} className="text-gray-300 hover:text-white flex items-center gap-1">
      <ChevronLeft size={20} /> {label}
    </button>
  );
}