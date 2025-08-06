import { useState } from 'react'
import { Shield, Eye, MapPin, MessageSquare, BarChart3, Download, Trash2, Settings } from 'lucide-react'
import { usePrivacySettings, useGrantConsent, useRevokeConsent, useCreateDataAccessRequest, useExportUserData, useDeleteUserData } from '../../hooks/use-privacy'
import { useTranslation } from 'react-i18next'

interface PrivacyConsentManagerProps {
  className?: string
  showAdvanced?: boolean
  onSettingsChange?: () => void
}

export function PrivacyConsentManager({ 
  className = '', 
  showAdvanced = false,
  onSettingsChange 
}: PrivacyConsentManagerProps) {
  const { t } = useTranslation()
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(showAdvanced)
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: privacySettings, isLoading } = usePrivacySettings()
  const grantConsent = useGrantConsent()
  const revokeConsent = useRevokeConsent()
  const createDataRequest = useCreateDataAccessRequest()
  const exportUserData = useExportUserData()
  const deleteUserData = useDeleteUserData()

  const handleConsentToggle = async (consentType: string, granted: boolean) => {
    try {
      if (granted) {
        await grantConsent.mutateAsync({ 
          consentType: consentType as any,
          ipAddress: '127.0.0.1', // In real app, get from request
          userAgent: navigator.userAgent
        })
      } else {
        await revokeConsent.mutateAsync({ consentType: consentType as any })
      }
      onSettingsChange?.()
    } catch (error) {
      console.error('Failed to update consent:', error)
    }
  }

  const handleExportData = async () => {
    try {
      setIsExporting(true)
      const data = await exportUserData.mutateAsync()
      
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export data:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteData = async () => {
    if (!confirm(t('privacy.confirmDeleteData'))) return
    
    try {
      setIsDeleting(true)
      await deleteUserData.mutateAsync()
      alert(t('privacy.dataDeleted'))
    } catch (error) {
      console.error('Failed to delete data:', error)
      alert(t('privacy.deleteError'))
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDataRequest = async (requestType: string) => {
    try {
      await createDataRequest.mutateAsync({
        requestType: requestType as any,
        description: `User requested ${requestType} of their data`,
        requestedData: ['profile', 'consents', 'gps_logs', 'service_visits']
      })
      alert(t('privacy.requestSubmitted'))
    } catch (error) {
      console.error('Failed to create data request:', error)
      alert(t('privacy.requestError'))
    }
  }

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t('privacy.title')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('privacy.description')}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Privacy Settings */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">
            {t('privacy.consentSettings')}
          </h4>
          
          <div className="space-y-3">
            {/* Data Collection */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">
                    {t('privacy.dataCollection')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('privacy.dataCollectionDesc')}
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={privacySettings?.data_collection || false}
                  onChange={(e) => handleConsentToggle('data_collection', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Location Tracking */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">
                    {t('privacy.locationTracking')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('privacy.locationTrackingDesc')}
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={privacySettings?.location_tracking || false}
                  onChange={(e) => handleConsentToggle('location_tracking', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Communications */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">
                    {t('privacy.communications')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('privacy.communicationsDesc')}
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={privacySettings?.communications || false}
                  onChange={(e) => handleConsentToggle('communications', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">
                    {t('privacy.analytics')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('privacy.analyticsDesc')}
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={privacySettings?.analytics || false}
                  onChange={(e) => handleConsentToggle('analytics', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="border-t pt-6">
          <button
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <Settings className="h-4 w-4" />
            {showAdvancedSettings ? t('privacy.hideAdvanced') : t('privacy.showAdvanced')}
          </button>

          {showAdvancedSettings && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Export Data */}
                <button
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? t('privacy.exporting') : t('privacy.exportData')}
                </button>

                {/* Delete Data */}
                <button
                  onClick={handleDeleteData}
                  disabled={isDeleting}
                  className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? t('privacy.deleting') : t('privacy.deleteData')}
                </button>
              </div>

              <div className="text-xs text-gray-500">
                {t('privacy.advancedDescription')}
              </div>
            </div>
          )}
        </div>

        {/* Legal Information */}
        <div className="border-t pt-6">
          <div className="text-xs text-gray-500 space-y-2">
            <p>{t('privacy.legalNotice')}</p>
            <p>{t('privacy.loi25Compliance')}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 