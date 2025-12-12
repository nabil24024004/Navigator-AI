import React from 'react';
import { UrgencyLevel } from '../types';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface UrgencyBadgeProps {
  level: UrgencyLevel;
}

const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ level }) => {
  const getStyles = () => {
    switch (level) {
      case UrgencyLevel.CRITICAL:
        return 'bg-danger/20 text-danger border-danger/50 animate-pulse';
      case UrgencyLevel.MEDIUM:
        return 'bg-warning/20 text-warning border-warning/50';
      case UrgencyLevel.LOW:
        return 'bg-success/20 text-success border-success/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getIcon = () => {
    switch (level) {
      case UrgencyLevel.CRITICAL: return <AlertTriangle className="w-5 h-5 mr-2" />;
      case UrgencyLevel.MEDIUM: return <AlertCircle className="w-5 h-5 mr-2" />;
      case UrgencyLevel.LOW: return <CheckCircle className="w-5 h-5 mr-2" />;
    }
  };

  return (
    <div className={`flex items-center px-4 py-2 rounded-full border backdrop-blur-md uppercase tracking-wider font-bold text-sm ${getStyles()}`}>
      {getIcon()}
      {level} URGENCY
    </div>
  );
};

export default UrgencyBadge;