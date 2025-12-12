import React from 'react';
import { UrgencyLevel } from '../types';
import { AlertTriangle, Phone } from 'lucide-react';

interface UrgencyBannerProps {
  level: UrgencyLevel;
}

const UrgencyBanner: React.FC<UrgencyBannerProps> = ({ level }) => {
  const isCritical = level === UrgencyLevel.CRITICAL;
  
  return (
    <div className={`w-full rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 border ${
        isCritical 
        ? 'bg-[#1A0A0A] border-red-500/20' 
        : level === UrgencyLevel.MEDIUM 
            ? 'bg-[#1A1005] border-yellow-500/20' 
            : 'bg-green-500/5 border-green-500/20'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            isCritical ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
            level === UrgencyLevel.MEDIUM ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
            'bg-green-500/10 text-green-500 border border-green-500/20'
        }`}>
            <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
            <div className={`font-bold uppercase tracking-wider text-sm mb-0.5 ${
                 isCritical ? 'text-red-500' : 
                 level === UrgencyLevel.MEDIUM ? 'text-yellow-500' : 
                 'text-green-500'
            }`}>
                {level === UrgencyLevel.CRITICAL ? 'Critical' : level}
            </div>
            <div className="text-gray-400 text-sm">
                {isCritical ? 'Immediate action required' : 'Monitor situation closely'}
            </div>
        </div>
      </div>

      {isCritical && (
          <button 
            onClick={() => window.location.href = "tel:999"}
            className="w-full md:w-auto px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-colors shadow-lg shadow-red-900/20"
          >
            <Phone className="w-5 h-5 fill-current" />
            <div className="text-left leading-tight">
                <div className="text-lg">999</div>
                <div className="text-[10px] uppercase opacity-80 font-normal">Call Emergency Services</div>
            </div>
          </button>
      )}
    </div>
  );
};

export default UrgencyBanner;