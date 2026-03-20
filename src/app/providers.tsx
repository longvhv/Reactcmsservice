'use client';

import { SystemSettingsProvider } from '../contexts/SystemSettingsContext';
import { LanguageProvider } from '../contexts/LanguageContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SystemSettingsProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </SystemSettingsProvider>
  );
}
