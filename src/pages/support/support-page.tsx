import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { EmptyState } from '../../components/shared/empty-state'
import { useFAQs } from '../../hooks/use-faqs'
import { useCompanyConfig } from '../../hooks/use-config'
import { useAuthStore } from '../../stores/auth-store'
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  Video,
  FileText,
  Users,
  Settings,
  Shield,
  AlertTriangle,
  Loader2
} from 'lucide-react'

export function SupportPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'technical' | 'billing' | 'service'>('all')

  const { data: faqs, isLoading, error } = useFAQs()
  const { data: companyConfig, isLoading: configLoading } = useCompanyConfig(user?.companyId || '')

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs || []
    : (faqs || []).filter(faq => faq.category === selectedCategory)

  const categories = [
    { id: 'all', label: 'All Questions', count: faqs?.length || 0 },
    { id: 'general', label: 'General', count: (faqs || []).filter(f => f.category === 'general').length },
    { id: 'technical', label: 'Technical', count: (faqs || []).filter(f => f.category === 'technical').length },
    { id: 'billing', label: 'Billing', count: (faqs || []).filter(f => f.category === 'billing').length },
    { id: 'service', label: 'Service', count: (faqs || []).filter(f => f.category === 'service').length }
  ]

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
              <p className="text-gray-600 mt-1">Get help with MonDeneigeur platform</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Live Chat</h3>
              </div>
              <p className="text-sm text-blue-800 mb-3">
                Chat with our support team in real-time
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                Start Chat
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Phone className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold text-green-900">Phone Support</h3>
              </div>
              <p className="text-sm text-green-800 mb-3">
                Call us for immediate assistance
              </p>
              <p className="text-lg font-semibold text-green-900">
                {configLoading ? 'Loading...' : companyConfig?.support_phone || '+1 (514) 555-0123'}
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Mail className="h-6 w-6 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Email Support</h3>
              </div>
              <p className="text-sm text-purple-800 mb-3">
                Send us a detailed message
              </p>
              <a 
                href={`mailto:${companyConfig?.contact_email || 'support@mondeneigeur.com'}`}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                {companyConfig?.contact_email || 'support@mondeneigeur.com'}
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Frequently Asked Questions</h2>
                <div className="flex space-x-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id as any)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.label} ({category.count})
                    </button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading FAQs...</span>
                </div>
              ) : error ? (
                <EmptyState
                  icon={AlertTriangle}
                  title="Unable to load FAQs"
                  description="There was an error loading the frequently asked questions. Please try again later."
                  actionText="Retry"
                  onAction={() => window.location.reload()}
                />
              ) : filteredFAQs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedFAQ === index ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {expandedFAQ === index && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={HelpCircle}
                  title="No FAQs found"
                  description={`No frequently asked questions found for the "${selectedCategory}" category.`}
                  actionText="View all FAQs"
                  onAction={() => setSelectedCategory('all')}
                />
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">
                      {configLoading ? 'Loading...' : companyConfig?.contact_phone || '+1 (514) 555-0123'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">
                      {companyConfig?.contact_email || 'support@mondeneigeur.com'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Hours</p>
                    <p className="text-sm text-gray-600">
                      {companyConfig?.business_hours || 'Mon-Fri: 8AM-6PM EST'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">
                      {companyConfig?.address || '123 Snow Street, Montréal, QC H1A 1A1'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
              <div className="space-y-3">
                <a href="/privacy-policy" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Privacy Policy</span>
                </a>
                <a href="/terms-of-service" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Terms of Service</span>
                </a>
                <a href="/support" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">User Guide</span>
                </a>
                <a href="/support" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Video className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Video Tutorials</span>
                </a>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Platform</span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Operational</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">GPS Services</span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Operational</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">File Upload</span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Operational</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Notifications</span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-yellow-600">Minor Issues</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Emergency Support</h3>
          </div>
          <p className="text-red-800 mb-3">
            For urgent service issues or safety concerns, contact our emergency support line:
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-xl font-bold text-red-900">
              {companyConfig?.emergency_phone || '+1 (514) 555-0124'}
            </span>
            <span className="text-sm text-red-700">Available 24/7</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 