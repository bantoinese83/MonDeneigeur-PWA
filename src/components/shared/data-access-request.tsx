import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { Spinner3D } from './3d-spinner'

interface DataAccessRequestProps {
  onRequestSubmit: (requestType: 'export' | 'delete') => void
}

export function DataAccessRequest({ onRequestSubmit }: DataAccessRequestProps) {
  const { t } = useTranslation()
  const [requestType, setRequestType] = useState<'export' | 'delete'>('export')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onRequestSubmit(requestType)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Data access request error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-sm text-green-800">
            {requestType === 'export' 
              ? t('settings.exportData') + ' - ' + t('success.dataSaved')
              : t('settings.deleteAccount') + ' - ' + t('success.dataDeleted')
            }
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start space-x-3">
        <FileText className="h-6 w-6 text-blue-600 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('settings.dataRights')}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {t('settings.dataAccess')}
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="requestType"
                  value="export"
                  checked={requestType === 'export'}
                  onChange={(e) => setRequestType(e.target.value as 'export' | 'delete')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">{t('settings.exportData')}</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="requestType"
                  value="delete"
                  checked={requestType === 'delete'}
                  onChange={(e) => setRequestType(e.target.value as 'export' | 'delete')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">{t('settings.deleteAccount')}</span>
              </label>
            </div>
            
            {requestType === 'delete' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <span className="text-xs text-yellow-800">
                    {t('settings.deleteAccount')} - {t('errors.generalError')}
                  </span>
                </div>
              </div>
            )}
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Spinner3D size="sm" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {isSubmitting ? t('common.loading') : t('common.confirm')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 