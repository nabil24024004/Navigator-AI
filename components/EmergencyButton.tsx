import React from 'react';
import { Phone } from 'lucide-react';

const EmergencyButton: React.FC = () => {
  const handleCall = () => {
    window.location.href = "tel:999";
  };

  return (
    <button
      onClick={handleCall}
      className="fixed bottom-6 right-6 z-50 bg-danger text-white rounded-full p-4 shadow-lg shadow-danger/40 hover:scale-105 transition-transform flex items-center gap-2 font-bold"
      aria-label="Call Emergency Services"
    >
      <Phone className="w-6 h-6 animate-pulse" />
      <span className="hidden md:inline">EMERGENCY (999)</span>
    </button>
  );
};

export default EmergencyButton;