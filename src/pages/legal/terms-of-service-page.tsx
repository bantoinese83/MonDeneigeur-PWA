import { useTranslation } from 'react-i18next'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { FileText, Scale, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react'

export function TermsOfServicePage() {
  const { t } = useTranslation()

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
              <p className="text-gray-600 mt-1">Last updated: January 2024</p>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              These Terms of Service ("Terms") govern your use of the MonDeneigeur platform and services. 
              By accessing or using our services, you agree to be bound by these Terms. If you disagree with 
              any part of these terms, you may not access our services.
            </p>

            {/* Service Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-6 w-6 mr-2 text-blue-600" />
                Service Description
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-3">MonDeneigeur Platform</h3>
                <p className="text-blue-800 mb-4">
                  MonDeneigeur provides a comprehensive snow removal service management platform that connects:
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <h4 className="font-medium mb-2">For Service Providers</h4>
                    <ul className="space-y-1">
                      <li>• Route management and optimization</li>
                      <li>• GPS tracking and location services</li>
                      <li>• Service visit documentation</li>
                      <li>• Employee management tools</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">For Clients</h4>
                    <ul className="space-y-1">
                      <li>• Service scheduling and tracking</li>
                      <li>• Contract management</li>
                      <li>• Service history and reports</li>
                      <li>• Real-time notifications</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* User Accounts */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Account Registration</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• You must provide accurate and complete information</li>
                    <li>• You are responsible for maintaining account security</li>
                    <li>• You must notify us immediately of any unauthorized use</li>
                    <li>• You must be at least 18 years old to create an account</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Account Responsibilities</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Keep your login credentials secure</li>
                    <li>• Do not share your account with others</li>
                    <li>• Update your information when it changes</li>
                    <li>• Comply with all applicable laws and regulations</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Service Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Scale className="h-6 w-6 mr-2 text-blue-600" />
                Service Terms
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">Service Providers</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Maintain appropriate insurance coverage</li>
                    <li>• Provide services in a professional manner</li>
                    <li>• Follow safety protocols and regulations</li>
                    <li>• Complete services as scheduled</li>
                    <li>• Document service completion with photos</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Clients</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Provide accurate service requirements</li>
                    <li>• Ensure access to service areas</li>
                    <li>• Pay for services as agreed</li>
                    <li>• Report issues promptly</li>
                    <li>• Maintain safe conditions for service providers</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Terms</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-yellow-900 mb-3">Payment and Billing</h3>
                <div className="space-y-3 text-sm text-yellow-800">
                  <div className="flex items-start space-x-2">
                    <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Payment Schedule</h4>
                      <p>Payments are due according to your contract terms. Late payments may incur fees.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Payment Methods</h4>
                      <p>We accept major credit cards, bank transfers, and other approved payment methods.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Disputes</h4>
                      <p>Payment disputes must be reported within 30 days of the service date.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy and Data */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy and Data Protection</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Data Collection and Use</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    We collect and process personal data as described in our Privacy Policy. By using our services, 
                    you consent to such processing.
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• GPS location data (with consent)</li>
                    <li>• Service visit photos and documentation</li>
                    <li>• Contact and billing information</li>
                    <li>• Usage analytics and performance data</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Data Security</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• We implement appropriate security measures</li>
                    <li>• Data is encrypted in transit and at rest</li>
                    <li>• Access is restricted to authorized personnel</li>
                    <li>• Regular security audits are conducted</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-red-600" />
                Prohibited Activities
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-red-900 mb-3">You agree not to:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-red-800">
                  <div>
                    <ul className="space-y-1">
                      <li>• Use the service for illegal purposes</li>
                      <li>• Attempt to gain unauthorized access</li>
                      <li>• Interfere with service operation</li>
                      <li>• Share false or misleading information</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-1">
                      <li>• Violate any applicable laws</li>
                      <li>• Harass or harm other users</li>
                      <li>• Reverse engineer the platform</li>
                      <li>• Use automated systems without permission</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Ownership</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    The MonDeneigeur platform, including its software, design, and content, is owned by 
                    MonDeneigeur Inc. and protected by copyright, trademark, and other intellectual property laws.
                  </p>
                  <p>
                    You retain ownership of content you upload, but grant us a license to use it for 
                    service delivery and platform improvement.
                  </p>
                  <p>
                    You may not copy, modify, distribute, or create derivative works without our written permission.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-orange-900 mb-3">Disclaimer</h3>
                <div className="space-y-3 text-sm text-orange-800">
                  <p>
                    MonDeneigeur provides the platform "as is" without warranties of any kind. We are not 
                    responsible for the quality of services provided by third-party service providers.
                  </p>
                  <p>
                    Our liability is limited to the amount you paid for our services in the 12 months 
                    preceding the claim.
                  </p>
                  <p>
                    We are not liable for indirect, incidental, or consequential damages.
                  </p>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Account Termination</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• You may terminate your account at any time</li>
                    <li>• We may terminate accounts for Terms violations</li>
                    <li>• Termination does not affect existing obligations</li>
                    <li>• Data may be retained as required by law</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Service Termination</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Services may be suspended for non-payment</li>
                    <li>• Emergency services may be terminated immediately</li>
                    <li>• Refunds are subject to our refund policy</li>
                    <li>• Outstanding balances remain due</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700">
                  These Terms are governed by the laws of Québec, Canada. Any disputes will be resolved 
                  in the courts of Montréal, Québec, unless otherwise required by law.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> legal@mondeneigeur.com</p>
                  <p><strong>Phone:</strong> +1 (514) 555-0123</p>
                  <p><strong>Address:</strong> 123 Snow Street, Montréal, QC H1A 1A1</p>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700">
                We may update these Terms from time to time. We will notify you of any material changes 
                by email or through the platform. Your continued use of the service after changes become 
                effective constitutes acceptance of the new Terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 