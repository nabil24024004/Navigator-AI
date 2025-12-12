import React, { useEffect, useState } from 'react';
import { Clock, Trash2, ArrowRight, AlertTriangle, AlertCircle, CheckCircle, Search, History as HistoryIcon, ImageIcon } from 'lucide-react';
import { IncidentState, UrgencyLevel } from '../types';
import { getHistory, deleteHistoryItem, clearHistory } from '../services/historyService';

interface HistoryProps {
  onLoadIncident: (incident: IncidentState) => void;
}

const History: React.FC<HistoryProps> = ({ onLoadIncident }) => {
  const [history, setHistory] = useState<IncidentState[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this record?")) {
        const updated = deleteHistoryItem(id);
        setHistory(updated);
    }
  };

  const handleClearAll = () => {
      if (window.confirm("Are you sure you want to clear all history? This cannot be undone.")) {
          clearHistory();
          setHistory([]);
      }
  };

  const filteredHistory = history.filter(item => {
      const dateStr = new Date(item.timestamp).toLocaleDateString();
      const contextMatch = item.contextText.toLowerCase().includes(searchTerm.toLowerCase());
      // Search in plan steps as well
      const planMatch = item.response?.plan.some(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
      return contextMatch || planMatch || dateStr.includes(searchTerm);
  });

  const getUrgencyIcon = (level: UrgencyLevel) => {
    switch (level) {
      case UrgencyLevel.CRITICAL: return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case UrgencyLevel.MEDIUM: return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case UrgencyLevel.LOW: return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getUrgencyColor = (level: UrgencyLevel) => {
      switch (level) {
          case UrgencyLevel.CRITICAL: return 'border-red-500/30 bg-red-500/10 text-red-400';
          case UrgencyLevel.MEDIUM: return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
          case UrgencyLevel.LOW: return 'border-green-500/30 bg-green-500/10 text-green-400';
          default: return 'border-gray-500/30 bg-gray-500/10 text-gray-400';
      }
  };

  if (history.length === 0) {
      return (
          <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <HistoryIcon className="w-10 h-10 text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-200 mb-2">No History Yet</h2>
              <p className="text-gray-400 mb-8">Your analyzed incidents will appear here for quick access.</p>
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold mb-1">Incident History</h1>
            <p className="text-gray-400 text-sm">Access past analysis and intervention plans</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Search history..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                />
            </div>
            {history.length > 0 && (
                <button 
                    onClick={handleClearAll}
                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg border border-red-500/20 transition-colors whitespace-nowrap z-10"
                >
                    Clear All
                </button>
            )}
        </div>
      </div>

      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
             <div className="text-center py-12 text-gray-500 bg-white/5 rounded-2xl border border-white/5">
                 No matching records found.
             </div>
        ) : (
            filteredHistory.map((item) => (
            <div 
                key={item.id}
                onClick={() => onLoadIncident(item)}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all cursor-pointer relative"
            >
                <div className="flex flex-col md:flex-row gap-0 md:gap-6">
                    {/* Image Thumbnail */}
                    <div className="w-full md:w-48 aspect-video md:aspect-square bg-black relative shrink-0">
                        {item.imageUrl ? (
                            <img src={item.imageUrl} alt="Incident" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:hidden" />
                        <div className="absolute bottom-3 left-3 md:hidden font-mono text-xs text-gray-300">
                            {new Date(item.timestamp).toLocaleDateString()}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 md:py-5 md:pr-16 md:pl-0 flex flex-col justify-center">
                        <div className="flex items-start justify-between mb-2">
                             <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${item.response ? getUrgencyColor(item.response.urgency) : ''}`}>
                                 {item.response ? getUrgencyIcon(item.response.urgency) : null}
                                 {item.response?.urgency || 'UNKNOWN'}
                             </div>
                             <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                                 <Clock className="w-3.5 h-3.5" />
                                 {new Date(item.timestamp).toLocaleString()}
                             </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                            {item.contextText || "Untitled Incident"}
                        </h3>
                        
                        <div className="space-y-1">
                            {item.response?.plan.slice(0, 2).map((step, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-400 line-clamp-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                                    {step.title}
                                </div>
                            ))}
                            {item.response && item.response.plan.length > 2 && (
                                <div className="text-xs text-gray-600 pl-3.5">
                                    +{item.response.plan.length - 2} more steps
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions - Added z-10 to ensure it sits above the card link */}
                <div className="absolute top-4 right-4 md:top-1/2 md:-translate-y-1/2 md:right-6 flex flex-col md:flex-row gap-3 z-10">
                    <button 
                        onClick={(e) => handleDelete(e, item.id)}
                        className="p-2 rounded-full bg-black/40 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors backdrop-blur-sm cursor-pointer"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-2 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform hidden md:block">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default History;