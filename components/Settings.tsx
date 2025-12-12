import React from 'react';
import { Bell, Volume2, Vibrate, MapPin, Smartphone, Settings as SettingsIcon, Info } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const Settings: React.FC = () => {
  const { settings, toggleSetting } = useSettings();

  const menuItems = [
    { key: 'notifications', icon: Bell, label: 'Push Notifications', desc: 'Receive alerts for emergency updates' },
    { key: 'sound', icon: Volume2, label: 'Sound Alerts', desc: 'Play audio for critical warnings' },
    { key: 'haptic', icon: Vibrate, label: 'Haptic Feedback', desc: 'Vibration for important actions' },
    { key: 'location', icon: MapPin, label: 'Location Services', desc: 'Auto-detect local emergency numbers' },
    { key: 'offline', icon: Smartphone, label: 'Offline Mode', desc: 'Cache plans for offline access' },
  ] as const;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
          <SettingsIcon className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Customize your Navigator AI experience</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-8">
        {menuItems.map((item, index) => (
          <div key={item.key} className={`p-5 flex items-center justify-between hover:bg-white/5 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-white/5' : ''}`}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-300">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">{item.label}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSetting(item.key)}
              className={`w-12 h-7 rounded-full transition-colors relative ${settings[item.key] ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${settings[item.key] ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4 text-red-500">
          <ShieldCheckIcon className="w-5 h-5" />
          <h3 className="font-bold text-white">Emergency Number</h3>
        </div>
        <p className="text-sm text-gray-400 mb-4">The emergency call button will dial this number. Currently set to your region's default.</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={settings.emergencyNumber} 
            readOnly 
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono"
          />
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 font-mono">
            {settings.regionLabel}
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4 text-blue-400">
          <Info className="w-5 h-5" />
          <h3 className="font-bold text-white">About Navigator AI</h3>
        </div>
        <div className="space-y-2 text-sm text-gray-400">
          <p>Version 1.0.0</p>
          <p>Powered by Gemini 3 Pro multimodal AI</p>
          <p className="pt-2 text-xs opacity-60">Navigator AI is designed to provide emergency guidance. Always prioritize your safety and call professional emergency services when needed.</p>
        </div>
      </div>
    </div>
  );
};

// Helper icon
const ShieldCheckIcon = ({className}:{className?:string}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
)

export default Settings;