import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import enTranslations from './locales/en.json'
import frTranslations from './locales/fr.json'

const resources = {
  en: {
    translation: enTranslations
  },
  fr: {
    translation: frTranslations
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Default language is French
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  })

export default i18n

// Language utilities
export const getCurrentLanguage = () => i18n.language

export const setLanguage = (language: 'fr' | 'en') => {
  i18n.changeLanguage(language)
  localStorage.setItem('preferred-language', language)
}

export const getPreferredLanguage = () => {
  return localStorage.getItem('preferred-language') as 'fr' | 'en' || 'fr'
}

export const initializeLanguage = () => {
  const savedLanguage = getPreferredLanguage()
  if (savedLanguage && savedLanguage !== i18n.language) {
    i18n.changeLanguage(savedLanguage)
  }
} 