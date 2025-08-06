import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../stores/auth-store'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { LanguageSwitcher } from '../../components/shared/language-switcher'
import { PrivacyConsent } from '../../components/shared/privacy-consent'
import { DataAccessRequest } from '../../components/shared/data-access-request'
import { Spinner3D } from '../../components/shared/3d-spinner'
import { 
  User,
  Bell,
  Shield,
  Globe,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export function SettingsPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'privacy' | 'language'>('account')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleConsentChange = (consent: boolean) => {
    console.log('Privacy consent changed:', consent)
    // TODO: Implement consent saving to database
  }

  const handleDataRequest = async (requestType: 'export' | 'delete') => {
    console.log('Data access request:', requestType)
    // TODO: Implement data access request handling
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // TODO: Implement settings save
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveStatus('success')
    } catch {
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'account', label: t('settings.account'), icon: User },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell },
    { id: 'privacy', label: t('settings.privacy'), icon: Shield },
    { id: 'language', label: t('settings.language'), icon: Globe }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('settings.title')}
          </h1>
          <p className="text-gray-600">
            {t('settings.account')} - {user?.email}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'account' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('settings.account')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('common.name')}
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.fullName || ''}
                    className="input w-full"
                    placeholder={t('common.name')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('common.email')}
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    disabled
                    className="input w-full bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('common.phone')}
                  </label>
                  <input
                    type="tel"
                    className="input w-full"
                    placeholder={t('common.phone')}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('settings.notifications')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{t('settings.emailNotifications')}</h4>
                    <p className="text-sm text-gray-600">{t('settings.emailNotifications')}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{t('settings.pushNotifications')}</h4>
                    <p className="text-sm text-gray-600">{t('settings.pushNotifications')}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{t('settings.smsNotifications')}</h4>
                    <p className="text-sm text-gray-600">{t('settings.smsNotifications')}</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <PrivacyConsent onConsentChange={handleConsentChange} />
              <DataAccessRequest onRequestSubmit={handleDataRequest} />
            </div>
          )}

          {activeTab === 'language' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('settings.language')}
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  {t('settings.language')} - {t('settings.language')}
                </p>
                <LanguageSwitcher />
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Spinner3D size="sm" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {isSaving ? t('common.loading') : t('common.save')}
            </span>
          </button>
        </div>

        {/* Save Status */}
        {saveStatus === 'success' && (
          <div className="mt-4 flex items-center space-x-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>{t('success.settingsUpdated')}</span>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="mt-4 flex items-center space-x-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{t('errors.generalError')}</span>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 