import { useTranslation } from 'react-i18next'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { Shield, Eye, Lock, FileText, CheckCircle } from 'lucide-react'

export function PrivacyPolicyPage() {
  const { t } = useTranslation()

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-600 mt-1">Last updated: January 2024</p>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              MonDeneigeur is committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
              snow removal services platform.
            </p>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="h-6 w-6 mr-2 text-blue-600" />
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Name, email address, and phone number</li>
                    <li>Company information and address</li>
                    <li>Service preferences and requirements</li>
                    <li>Payment information (processed securely)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Service Data</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Service visit records and photos</li>
                    <li>GPS location data (with consent)</li>
                    <li>Route information and schedules</li>
                    <li>Contract and billing information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Technical Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Device information and IP addresses</li>
                    <li>Usage analytics and performance data</li>
                    <li>Browser type and operating system</li>
                    <li>Error logs and crash reports</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="h-6 w-6 mr-2 text-blue-600" />
                How We Use Your Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Service Delivery</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Schedule and manage service visits</li>
                    <li>• Track service completion</li>
                    <li>• Process payments and billing</li>
                    <li>• Send service notifications</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Platform Improvement</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Analyze usage patterns</li>
                    <li>• Improve user experience</li>
                    <li>• Fix technical issues</li>
                    <li>• Develop new features</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Communication</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Send service updates</li>
                    <li>• Provide customer support</li>
                    <li>• Send important notices</li>
                    <li>• Marketing (with consent)</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Legal Compliance</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Comply with regulations</li>
                    <li>• Respond to legal requests</li>
                    <li>• Protect against fraud</li>
                    <li>• Maintain security</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Loi 25 Compliance */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                Your Rights (Loi 25 Compliance)
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-3">Québec Privacy Law Compliance</h3>
                <p className="text-blue-800 mb-4">
                  Under Québec's Law 25 (Loi 25), you have specific rights regarding your personal information:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900">Right to Access</h4>
                        <p className="text-sm text-blue-800">Request a copy of your personal information</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900">Right to Correction</h4>
                        <p className="text-sm text-blue-800">Request correction of inaccurate information</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900">Right to Portability</h4>
                        <p className="text-sm text-blue-800">Export your data in a structured format</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900">Right to Deletion</h4>
                        <p className="text-sm text-blue-800">Request deletion of your personal information</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900">Right to Object</h4>
                        <p className="text-sm text-blue-800">Object to certain processing activities</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900">Right to Information</h4>
                        <p className="text-sm text-blue-800">Be informed about data processing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-green-900 mb-3">How We Protect Your Data</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
                  <div>
                    <h4 className="font-medium mb-2">Technical Measures</h4>
                    <ul className="space-y-1">
                      <li>• End-to-end encryption</li>
                      <li>• Secure data centers</li>
                      <li>• Regular security audits</li>
                      <li>• Access controls</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Organizational Measures</h4>
                    <ul className="space-y-1">
                      <li>• Employee training</li>
                      <li>• Privacy by design</li>
                      <li>• Incident response plans</li>
                      <li>• Regular policy reviews</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or wish to exercise your rights, 
                  please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> privacy@mondeneigeur.com</p>
                  <p><strong>Phone:</strong> +1 (514) 555-0123</p>
                  <p><strong>Address:</strong> 123 Snow Street, Montréal, QC H1A 1A1</p>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Policy Updates</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 