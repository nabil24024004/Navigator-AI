import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SettingsState {
  notifications: boolean;
  sound: boolean;
  haptic: boolean;
  location: boolean;
  offline: boolean;
  emergencyNumber: string;
  regionLabel: string;
}

const defaultSettings: SettingsState = {
  notifications: false,
  sound: true,
  haptic: true,
  location: false,
  offline: true,
  emergencyNumber: '999',
  regionLabel: 'Default (Region)'
};

interface SettingsContextType {
  settings: SettingsState;
  toggleSetting: (key: keyof Omit<SettingsState, 'emergencyNumber' | 'regionLabel'>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Helper to determine region and number from timezone
const detectRegion = (): { number: string; label: string } => {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!timeZone) return { number: '112', label: 'International (112)' };

    if (timeZone.startsWith('America/')) {
      return { number: '911', label: 'North America (911)' };
    } else if (timeZone === 'Europe/London' || timeZone === 'Europe/Belfast') {
      return { number: '999', label: 'United Kingdom (999)' };
    } else if (timeZone.startsWith('Europe/')) {
      return { number: '112', label: 'Europe (112)' };
    } else if (timeZone.startsWith('Australia/')) {
      return { number: '000', label: 'Australia (000)' };
    } else if (timeZone.startsWith('Asia/Kolkata') || timeZone.startsWith('Asia/Calcutta')) {
       return { number: '112', label: 'India (112)' };
    } else if (timeZone.startsWith('Asia/')) {
       return { number: '112', label: 'Asia (112)' }; 
    } else if (timeZone.startsWith('Africa/')) {
       return { number: '112', label: 'Africa (112)' };
    }
    
    return { number: '112', label: `International (${timeZone})` };
  } catch (e) {
    return { number: '999', label: 'Default (Region)' };
  }
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('navigator-settings');
    if (saved) {
      setSettings({ ...defaultSettings, ...JSON.parse(saved) });
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('navigator-settings', JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const toggleSetting = (key: keyof Omit<SettingsState, 'emergencyNumber' | 'regionLabel'>) => {
    setSettings(prev => {
      const newValue = !prev[key];
      const newState = { ...prev, [key]: newValue };

      // --- Feature Logic ---

      // 1. Push Notifications
      if (key === 'notifications' && newValue) {
        if ('Notification' in window) {
          Notification.requestPermission().then(permission => {
            if (permission !== 'granted') {
              // If denied, we could flip it back, but let's leave it as a user preference state
              console.warn('Notification permission denied');
            }
          });
        }
      }

      // 2. Location Services
      if (key === 'location') {
        if (newValue) {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                 // We have permission. Now infer region from Timezone as it is more reliable for Client-side mapping without an API.
                 // (Coordinates would require a reverse geocoding API).
                 const { number, label } = detectRegion();
                 
                 setSettings(s => ({
                   ...s,
                   location: true,
                   emergencyNumber: number,
                   regionLabel: label
                 }));
              },
              (err) => {
                console.error("Geolocation error", err);
                // Revert if permission denied
                setSettings(s => ({ ...s, location: false }));
                alert("Could not detect location. Please check browser permissions.");
              },
              { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
            );
          } else {
             alert("Geolocation is not supported by your browser.");
             return prev; // Do not update state
          }
        } else {
          // Reset to default when disabled
          return {
            ...newState,
            emergencyNumber: '999',
            regionLabel: 'Default (Region)'
          };
        }
      }

      return newState;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, toggleSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};