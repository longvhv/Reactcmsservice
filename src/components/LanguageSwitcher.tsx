import { useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

const languages = [
  { code: 'vi' as Language, name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
  { code: 'zh' as Language, name: '中文', flag: '🇨🇳' },
  { code: 'ja' as Language, name: '日本語', flag: '🇯🇵' },
  { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
];

interface LanguageSwitcherProps {
  variant?: 'sidebar' | 'dropdown' | 'icon';
}

export function LanguageSwitcher({ variant = 'dropdown' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  if (variant === 'sidebar') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 group"
        >
          <Globe className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="flex-1 text-left text-sm text-foreground">{currentLanguage.name}</span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border/60 rounded-xl shadow-xl z-20 overflow-hidden animate-slide-in-top">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/60 transition-all duration-200 ${
                    language === lang.code ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="flex-1 text-left text-sm">{lang.name}</span>
                  {language === lang.code && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 group relative overflow-hidden"
          title={currentLanguage.name}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Globe className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-all duration-200 relative z-10" />
          <span className="absolute -top-1 -right-1 text-xs">{currentLanguage.flag}</span>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-48 bg-card/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-2xl shadow-black/10 z-20 overflow-hidden animate-slide-in-top">
              {/* Gradient header */}
              <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              
              <div className="p-2 border-b border-border/60 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                <h4 className="text-xs font-semibold text-foreground px-2">Select Language</h4>
              </div>
              <div className="p-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-all duration-200 ${
                      language === lang.code ? 'bg-blue-50 text-blue-700' : ''
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="flex-1 text-left text-sm">{lang.name}</span>
                    {language === lang.code && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/60 hover:bg-muted/40 transition-all duration-200 group"
      >
        <Globe className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="text-sm text-foreground">{currentLanguage.name}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border/60 rounded-xl shadow-2xl shadow-black/10 z-20 overflow-hidden animate-slide-in-top">
            <div className="p-2 border-b border-border/60 bg-gradient-to-r from-blue-50 to-purple-50">
              <h4 className="text-xs font-semibold text-foreground px-2">Select Language</h4>
            </div>
            <div className="p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-all duration-200 ${
                    language === lang.code ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="flex-1 text-left text-sm">{lang.name}</span>
                  {language === lang.code && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}