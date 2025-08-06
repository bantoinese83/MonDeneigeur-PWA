import { useState } from 'react'
import { useAuthStore } from '../../stores/auth-store'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { Spinner3D } from '../../components/shared/3d-spinner'
import { useClientPreferences, useUpdateClientPreferences } from '../../hooks/use-client-portal'
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Settings,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export function ClientSettingsPage() {
  const { user } = useAuthStore()
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const { data: preferences, isLoading } = useClientPreferences()
  const updatePreferences = useUpdateClientPreferences()

  const [formData, setFormData] = useState({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    notification_types: {
      service_updates: true,
      schedule_changes: true,
      contract_updates: true,
      payment_reminders: false,
      weather_alerts: true
    }
  })

  // Update form data when preferences load
  useState(() => {
    if (preferences) {
      setFormData({
        email_notifications: preferences.email_notifications ?? true,
        push_notifications: preferences.push_notifications ?? true,
        sms_notifications: preferences.sms_notifications ?? false,
        notification_types: {
          service_updates: preferences.notification_types?.service_updates ?? true,
          schedule_changes: preferences.notification_types?.schedule_changes ?? true,
          contract_updates: preferences.notification_types?.contract_updates ?? true,
          payment_reminders: preferences.notification_types?.payment_reminders ?? false,
          weather_alerts: preferences.notification_types?.weather_alerts ?? true
        }
      })
    }
  })

  const handleToggle = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }))
  }

  const handleNotificationTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      notification_types: {
        ...prev.notification_types,
        [type]: !prev.notification_types[type as keyof typeof prev.notification_types]
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('idle')

    try {
      await updatePreferences.mutateAsync(formData)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Save className="h-5 w-5" />
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <Spinner3D size="md" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and notifications</p>
        </div>

        {/* Notification Preferences */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <h3 className="card-title">Notification Preferences</h3>
            </div>
            <p className="card-description">Choose how you want to receive updates</p>
          </div>
          <div className="card-content space-y-6">
            {/* Notification Channels */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Notification Channels</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('email_notifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.email_notifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.email_notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-600">Receive browser notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('push_notifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.push_notifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.push_notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Receive text message updates</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('sms_notifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.sms_notifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.sms_notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Types */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Notification Types</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Service Updates</p>
                    <p className="text-sm text-gray-600">Status changes and progress</p>
                  </div>
                  <button
                    onClick={() => handleNotificationTypeToggle('service_updates')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.notification_types.service_updates ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.notification_types.service_updates ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Schedule Changes</p>
                    <p className="text-sm text-gray-600">Appointment updates</p>
                  </div>
                  <button
                    onClick={() => handleNotificationTypeToggle('schedule_changes')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.notification_types.schedule_changes ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.notification_types.schedule_changes ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Contract Updates</p>
                    <p className="text-sm text-gray-600">Document and policy changes</p>
                  </div>
                  <button
                    onClick={() => handleNotificationTypeToggle('contract_updates')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.notification_types.contract_updates ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.notification_types.contract_updates ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Payment Reminders</p>
                    <p className="text-sm text-gray-600">Billing and payment updates</p>
                  </div>
                  <button
                    onClick={() => handleNotificationTypeToggle('payment_reminders')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.notification_types.payment_reminders ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.notification_types.payment_reminders ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Weather Alerts</p>
                    <p className="text-sm text-gray-600">Weather-related service updates</p>
                  </div>
                  <button
                    onClick={() => handleNotificationTypeToggle('weather_alerts')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.notification_types.weather_alerts ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.notification_types.weather_alerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <h3 className="card-title">Account Information</h3>
            </div>
            <p className="card-description">Your account details</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <span className="text-xs text-gray-500">Primary</span>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Full Name</p>
                  <p className="text-sm text-gray-600">{user?.fullName || 'Not provided'}</p>
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  Edit
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Account Type</p>
                  <p className="text-sm text-gray-600">Client</p>
                </div>
                <span className="text-xs text-gray-500">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary flex items-center space-x-2"
          >
            {getSaveStatusIcon()}
            <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>

        {/* Save Status */}
        {saveStatus !== 'idle' && (
          <div className={`p-4 rounded-lg ${
            saveStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {getSaveStatusIcon()}
              <span className={`text-sm font-medium ${
                saveStatus === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {saveStatus === 'success' ? 'Preferences saved successfully!' : 'Failed to save preferences'}
              </span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 