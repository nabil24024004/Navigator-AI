import React from 'react';
import { Phone } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const EmergencyButton: React.FC = () => {
  const { settings } = useSettings();
  
  const handleCall = () => {
    window.location.href = `tel:${settings.emergencyNumber}`;
  };

  return (
    <button
      onClick={handleCall}
      className="fixed bottom-6 right-6 z-50 bg-danger text-white rounded-full p-4 shadow-lg shadow-danger/40 hover:scale-105 transition-transform flex items-center gap-2 font-bold"
      aria-label={`Call Emergency Services (${settings.emergencyNumber})`}
    >
      <Phone className="w-6 h-6 animate-pulse" />
      <span className="hidden md:inline">EMERGENCY ({settings.emergencyNumber})</span>
    </button>
  );
};

export default EmergencyButton;