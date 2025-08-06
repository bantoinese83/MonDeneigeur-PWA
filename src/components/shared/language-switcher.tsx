import { Globe, ChevronDown } from 'lucide-react'
import { setLanguage, getCurrentLanguage } from '../../lib/i18n'

export function LanguageSwitcher() {
  const currentLanguage = getCurrentLanguage()

  const handleLanguageChange = (language: 'fr' | 'en') => {
    setLanguage(language)
  }

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center space-x-2">
        <Globe className="h-4 w-4 text-gray-600" />
        <button
          onClick={() => handleLanguageChange(currentLanguage === 'fr' ? 'en' : 'fr')}
          className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
        >
          <span className="uppercase">{currentLanguage}</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
} 