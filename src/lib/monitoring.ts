import * as Sentry from '@sentry/react'
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

// Initialize Sentry for error tracking
export const initializeSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    })
  }
}

// Performance monitoring with Web Vitals
export const initializePerformanceMonitoring = () => {
  if (import.meta.env.PROD) {
    // Core Web Vitals with proper reporting
    getCLS(reportPerformance)
    getFID(reportPerformance)
    getFCP(reportPerformance)
    getLCP(reportPerformance)
    getTTFB(reportPerformance)
  }
}

// Error boundary component
export const ErrorBoundary = Sentry.ErrorBoundary

// Custom error reporting
export const reportError = (error: Error, context?: Record<string, any>) => {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      extra: context,
    })
  } else {
    console.error('Error:', error, context)
  }
}

// Performance monitoring
export const reportPerformance = (metric: any) => {
  if (import.meta.env.PROD) {
    Sentry.metrics.increment('web_vital', {
      value: metric.value,
      unit: metric.unit,
      tags: {
        metric_name: metric.name,
      },
    })
  }
}

// User analytics
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (import.meta.env.PROD) {
    Sentry.addBreadcrumb({
      category: 'user_action',
      message: eventName,
      data: properties,
      level: 'info',
    })
  }
}

// Page view tracking
export const trackPageView = (pageName: string) => {
  if (import.meta.env.PROD) {
    Sentry.setTag('page', pageName)
    trackEvent('page_view', { page: pageName })
  }
}

// User identification
export const identifyUser = (userId: string, userData?: Record<string, any>) => {
  if (import.meta.env.PROD) {
    Sentry.setUser({
      id: userId,
      ...userData,
    })
  }
}

// Custom performance measurement
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now()
  fn()
  const duration = performance.now() - start
  
  if (import.meta.env.PROD) {
    Sentry.metrics.timing('custom_performance', duration, {
      tags: {
        operation: name,
      },
    })
  }
  
  return duration
}

// API error tracking
export const trackApiError = (endpoint: string, error: any, status?: number) => {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      tags: {
        endpoint,
        status: status?.toString(),
      },
      extra: {
        endpoint,
        status,
        error: error.message,
      },
    })
  }
}

// Memory usage monitoring
export const trackMemoryUsage = () => {
  if (import.meta.env.PROD && 'memory' in performance) {
    const memory = (performance as any).memory
    Sentry.metrics.gauge('memory_usage', memory.usedJSHeapSize, {
      tags: {
        type: 'used',
      },
    })
    Sentry.metrics.gauge('memory_limit', memory.jsHeapSizeLimit, {
      tags: {
        type: 'limit',
      },
    })
  }
}

// Network performance tracking
export const trackNetworkPerformance = (url: string, duration: number, status: number) => {
  if (import.meta.env.PROD) {
    Sentry.metrics.timing('network_request', duration, {
      tags: {
        url,
        status: status.toString(),
      },
    })
  }
} 