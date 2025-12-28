import React, { createContext, useContext, useState, useEffect } from 'react';
import viTranslations from '../locales/vi';
import enTranslations from '../locales/en';
import esTranslations from '../locales/es';
import zhTranslations from '../locales/zh';
import jaTranslations from '../locales/ja';
import koTranslations from '../locales/ko';

export type Language = 'vi' | 'en' | 'es' | 'zh' | 'ja' | 'ko';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

// Translation map
const translationsMap: Record<Language, Record<string, any>> = {
  vi: viTranslations,
  en: enTranslations,
  es: esTranslations,
  zh: zhTranslations,
  ja: jaTranslations,
  ko: koTranslations,
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('cms-language');
    return (saved as Language) || 'vi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cms-language', lang);
  };

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const translations = translationsMap[language];
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    // Replace variables in the format {{variableName}}
    if (variables) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
        return variables[variableName] !== undefined 
          ? String(variables[variableName]) 
          : match;
      });
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}