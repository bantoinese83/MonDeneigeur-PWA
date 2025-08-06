import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAuthStore } from './stores/auth-store'
import { RouteRenderer } from './components/routing/route-renderer'
import { LoadingSpinner } from './components/routing/loading-spinner'
import { ErrorBoundary } from './components/shared/error-boundary'
import { publicRoutes, protectedRoutes, fallbackRoutes } from './lib/routes'
import { 
  initializeSentry, 
  initializePerformanceMonitoring, 
  identifyUser 
} from './lib/monitoring'

// Initialize monitoring
initializeSentry()
initializePerformanceMonitoring()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnMount: false,
      refetchOnReconnect: true
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error)
      }
    }
  }
})

function AppRoutes() {
  const { isAuthenticated, isLoading, user, checkAuth } = useAuthStore()

  // Check authentication on app load
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Track user identification
  useEffect(() => {
    if (user && isAuthenticated) {
      identifyUser(user.id, {
        email: user.email,
        role: user.role,
        company_id: user.companyId
      })
    }
  }, [user, isAuthenticated])

  if (isLoading) {
    return <LoadingSpinner message="" />
  }

  return (
    <Routes>
      {/* Public routes */}
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<RouteRenderer route={route} isAuthenticated={isAuthenticated} />}
        />
      ))}
      
      {/* Protected routes */}
      {protectedRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<RouteRenderer route={route} isAuthenticated={isAuthenticated} />}
        />
      ))}
      
      {/* Fallback routes */}
      {fallbackRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<RouteRenderer route={route} isAuthenticated={isAuthenticated} />}
        />
      ))}
    </Routes>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppRoutes />
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
