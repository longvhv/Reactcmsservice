import React, { createContext, useContext, useState, useEffect } from 'react';

interface SystemSettings {
  royaltyEnabled: boolean;
  mediaLibraryEnabled: boolean;
  crawlerEnabled: boolean;
  multiLanguageEnabled: boolean;
  commentsEnabled: boolean;
  notificationsEnabled: boolean;
}

interface SystemSettingsContextType {
  settings: SystemSettings;
  updateSetting: <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => void;
  isRoyaltyEnabled: boolean;
}

const defaultSettings: SystemSettings = {
  royaltyEnabled: true,
  mediaLibraryEnabled: true,
  crawlerEnabled: true,
  multiLanguageEnabled: true,
  commentsEnabled: true,
  notificationsEnabled: true,
};

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

export function SystemSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('systemSettings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof SystemSettings>(
    key: K,
    value: SystemSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const value: SystemSettingsContextType = {
    settings,
    updateSetting,
    isRoyaltyEnabled: settings.royaltyEnabled,
  };

  return (
    <SystemSettingsContext.Provider value={value}>
      {children}
    </SystemSettingsContext.Provider>
  );
}

export function useSystemSettings() {
  const context = useContext(SystemSettingsContext);
  if (!context) {
    throw new Error('useSystemSettings must be used within SystemSettingsProvider');
  }
  return context;
}
