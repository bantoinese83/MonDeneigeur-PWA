import { Navigation } from './navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
  showBreadcrumbs?: boolean
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function DashboardLayout({ 
  children, 
  className = '',
  showBreadcrumbs = false,
  breadcrumbs = []
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {showBreadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <svg className="h-4 w-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {breadcrumb.href ? (
                    <a 
                      href={breadcrumb.href}
                      className="hover:text-gray-700 transition-colors duration-200"
                    >
                      {breadcrumb.label}
                    </a>
                  ) : (
                    <span className="text-gray-900 font-medium">{breadcrumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        
        <div className={`space-y-6 ${className}`}>
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-auto py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-white sticky bottom-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>© {new Date().getFullYear()} MonDeneigeur. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Professional snow removal services</span>
            </div>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
              <a href="/privacy-policy" className="hover:text-gray-700 transition-colors duration-200">
                Privacy Policy
              </a>
              <span className="hidden sm:inline">•</span>
              <a href="/terms-of-service" className="hover:text-gray-700 transition-colors duration-200">
                Terms of Service
              </a>
              <span className="hidden sm:inline">•</span>
              <a href="/support" className="hover:text-gray-700 transition-colors duration-200">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 