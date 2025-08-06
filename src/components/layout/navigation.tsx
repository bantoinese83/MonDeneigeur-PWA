import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../stores/auth-store'
import { LanguageSwitcher } from '../shared/language-switcher'

import { 
  Home, 
  Building2, 
  Users, 
  UserCheck, 
  FileText, 
  Route, 
  Activity, 
  Settings,
  Calendar,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
  badge?: number
}

export function Navigation() {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  if (!user) return null

  // Get the appropriate dashboard path for the user's role
  const getDashboardPath = (role: string) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard'
      case 'employee':
        return '/employee/dashboard'
      case 'client':
        return '/client/dashboard'
      case 'superadmin':
        return '/dashboard'
      default:
        return '/dashboard'
    }
  }

  // Get the appropriate dashboard icon for the user's role
  const getDashboardIcon = (role: string) => {
    switch (role) {
      case 'employee':
      case 'client':
        return Calendar
      default:
        return Home
    }
  }

  const navItems: NavItem[] = [
    // Dynamic dashboard based on user role
    {
      label: t('navigation.dashboard'),
      href: getDashboardPath(user.role),
      icon: getDashboardIcon(user.role),
      roles: ['superadmin', 'admin', 'employee', 'client']
    },
    {
      label: t('navigation.companies'),
      href: '/companies',
      icon: Building2,
      roles: ['superadmin']
    },
    {
      label: t('navigation.employees'),
      href: '/employees',
      icon: Users,
      roles: ['admin']
    },
    {
      label: t('navigation.clients'),
      href: '/clients',
      icon: UserCheck,
      roles: ['admin']
    },
    {
      label: t('navigation.contracts'),
      href: '/contracts',
      icon: FileText,
      roles: ['admin']
    },
    {
      label: t('navigation.routes'),
      href: '/routes',
      icon: Route,
      roles: ['admin']
    },
    {
      label: t('navigation.audit'),
      href: '/audit',
      icon: Activity,
      roles: ['superadmin', 'admin']
    },
    {
      label: t('navigation.settings'),
      href: '/settings',
      icon: Settings,
      roles: ['superadmin', 'admin', 'employee', 'client']
    }
  ]

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user.role)
  )

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'superadmin': return 'System Administrator'
      case 'admin': return 'Administrator'
      case 'employee': return 'Employee'
      case 'client': return 'Client'
      default: return role
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'employee': return 'bg-green-100 text-green-800 border-green-200'
      case 'client': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to={getDashboardPath(user.role)} className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors duration-200">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight group-hover:text-primary-700 transition-colors duration-200">
                  MonDeneigeur
                </h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`nav-item inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
          
          {/* User Menu and Actions */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {/* User Profile Section */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">
                    {user.fullName || user.email}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                    {getRoleDisplayName(user.role)}
                  </span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.fullName || user.email}</p>
                    <p className="text-xs text-gray-500">{getRoleDisplayName(user.role)}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 border-t border-gray-200">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
} 