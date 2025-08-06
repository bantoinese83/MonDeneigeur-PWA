import type { RouteConfig } from './types'
import { LoginPage } from '../pages/auth/login-page'
import { RegisterPage } from '../pages/auth/register-page'
import { DashboardPage } from '../pages/dashboard/dashboard-page'
import { CompaniesPage } from '../pages/superadmin/companies-page'
import { AdminDashboardPage } from '../pages/admin/admin-dashboard-page'
import { EmployeesPage } from '../pages/admin/employees-page'
import { ClientsPage } from '../pages/admin/clients-page'
import { ContractsPage } from '../pages/admin/contracts-page'
import { RoutesPage } from '../pages/admin/routes-page'
import { AuditPage } from '../pages/admin/audit-page'
import { EmployeeDashboardPage } from '../pages/employee/employee-dashboard-page'
import { RouteDetailPage } from '../pages/employee/route-detail-page'
import { ClientDashboardPage } from '../pages/client/client-dashboard-page'
import { ClientSettingsPage } from '../pages/client/client-settings-page'
import { ServiceHistoryPage } from '../pages/client/service-history-page'
import { SettingsPage } from '../pages/settings/settings-page'
import { PrivacyPolicyPage } from '../pages/legal/privacy-policy-page'
import { TermsOfServicePage } from '../pages/legal/terms-of-service-page'
import { SupportPage } from '../pages/support/support-page'

export const publicRoutes: RouteConfig[] = [
  {
    path: '/login',
    element: LoginPage,
    redirectIfAuthenticated: '/dashboard'
  },
  {
    path: '/register',
    element: RegisterPage,
    redirectIfAuthenticated: '/dashboard'
  },
  {
    path: '/privacy-policy',
    element: PrivacyPolicyPage
  },
  {
    path: '/terms-of-service',
    element: TermsOfServicePage
  },
  {
    path: '/support',
    element: SupportPage
  }
]

export const protectedRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    element: DashboardPage,
    allowedRoles: ['superadmin', 'admin', 'employee', 'client']
  },
  {
    path: '/companies',
    element: CompaniesPage,
    allowedRoles: ['superadmin']
  },
  {
    path: '/admin/dashboard',
    element: AdminDashboardPage,
    allowedRoles: ['admin']
  },
  {
    path: '/employees',
    element: EmployeesPage,
    allowedRoles: ['admin']
  },
  {
    path: '/clients',
    element: ClientsPage,
    allowedRoles: ['admin']
  },
  {
    path: '/contracts',
    element: ContractsPage,
    allowedRoles: ['admin', 'client']
  },
  {
    path: '/routes',
    element: RoutesPage,
    allowedRoles: ['admin']
  },
  {
    path: '/audit',
    element: AuditPage,
    allowedRoles: ['superadmin', 'admin']
  },
  {
    path: '/employee/dashboard',
    element: EmployeeDashboardPage,
    allowedRoles: ['employee']
  },
  {
    path: '/employee/route/:visitId',
    element: RouteDetailPage,
    allowedRoles: ['employee']
  },
  {
    path: '/client/dashboard',
    element: ClientDashboardPage,
    allowedRoles: ['client']
  },
  {
    path: '/client/settings',
    element: ClientSettingsPage,
    allowedRoles: ['client']
  },
  {
    path: '/settings',
    element: SettingsPage,
    allowedRoles: ['superadmin', 'admin', 'employee', 'client']
  },
  {
    path: '/service-history',
    element: ServiceHistoryPage,
    allowedRoles: ['client']
  }
]

export const fallbackRoutes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '*',
    redirect: '/dashboard'
  }
] 