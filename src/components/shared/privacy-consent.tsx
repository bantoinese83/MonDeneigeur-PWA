import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Shield, CheckCircle } from 'lucide-react'

interface PrivacyConsentProps {
  onConsentChange: (consent: boolean) => void
  initialConsent?: boolean
}

export function PrivacyConsent({ onConsentChange, initialConsent = false }: PrivacyConsentProps) {
  const { t } = useTranslation()
  const [consent, setConsent] = useState(initialConsent)
  const [showDetails, setShowDetails] = useState(false)

  const handleConsentChange = (newConsent: boolean) => {
    setConsent(newConsent)
    onConsentChange(newConsent)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start space-x-3">
        <Shield className="h-6 w-6 text-blue-600 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('settings.consent')}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {t('settings.privacyPolicy')} - {t('settings.dataRights')}
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="privacy-consent"
                checked={consent}
                onChange={(e) => handleConsentChange(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="privacy-consent" className="text-sm text-gray-700">
                {t('settings.consent')}
              </label>
            </div>
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {showDetails ? t('common.close') : t('settings.privacyPolicy')}
            </button>
            
            {showDetails && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm text-gray-700">
                <h4 className="font-medium mb-2">{t('settings.dataRights')}</h4>
                <ul className="space-y-1 text-xs">
                  <li>• {t('settings.dataAccess')}</li>
                  <li>• {t('settings.exportData')}</li>
                  <li>• {t('settings.deleteAccount')}</li>
                </ul>
              </div>
            )}
          </div>
          
          {consent && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>{t('success.settingsUpdated')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 