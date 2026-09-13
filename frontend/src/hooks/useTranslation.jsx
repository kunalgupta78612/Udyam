import { createContext, useContext, useState, useCallback } from 'react';
import strings from '../i18n/strings';

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('udyam_lang') || 'en'; }
    catch { return 'en'; }
  });

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'hi' : 'en';
      try { localStorage.setItem('udyam_lang', next); } catch {}
      return next;
    });
  }, []);

  const setLanguage = useCallback((newLang) => {
    setLang(newLang);
    try { localStorage.setItem('udyam_lang', newLang); } catch {}
  }, []);

  const t = useCallback((key) => {
    return strings[lang]?.[key] || strings.en?.[key] || key;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, toggleLang, setLanguage, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const TranslationProvider = LangProvider;

export function useTranslation() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useTranslation must be used within LangProvider');
  return ctx;
}
