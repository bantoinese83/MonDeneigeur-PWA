import { Snowflake } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface to-surface-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-3">
              <Snowflake className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              MonDeneigeur
            </h1>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="text-gray-600 text-base">{subtitle}</p>
            )}
          </div>
        </div>
        
        {/* Auth Form Container */}
        <div className="card">
          <div className="card-content">
            {children}
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Professional snow removal services
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Secure • Reliable • Professional
          </p>
        </div>
      </div>
    </div>
  )
} 