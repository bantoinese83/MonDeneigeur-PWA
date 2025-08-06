# MonDeneigeur PWA - Performance Guide

This document provides a comprehensive performance guide for the MonDeneigeur PWA, including optimization strategies, monitoring, and best practices.

## 📋 Table of Contents

- [Overview](#overview)
- [Core Web Vitals](#core-web-vitals)
- [Bundle Optimization](#bundle-optimization)
- [Image Optimization](#image-optimization)
- [Caching Strategies](#caching-strategies)
- [Database Performance](#database-performance)
- [API Performance](#api-performance)
- [PWA Performance](#pwa-performance)
- [Monitoring & Analytics](#monitoring--analytics)
- [Performance Testing](#performance-testing)
- [Best Practices](#best-practices)

## Overview

The MonDeneigeur PWA is optimized for performance with the following key metrics:

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Bundle Size**: < 500KB gzipped
- **Time to Interactive**: < 3s
- **PWA Score**: 90+

## Core Web Vitals

### LCP (Largest Contentful Paint)

**Target**: < 2.5s

**Optimization Strategies**:

```typescript
// LCP optimization
export class LCPOptimization {
  static async optimizeLCP(): Promise<void> {
    // 1. Optimize critical resources
    await this.preloadCriticalResources()
    
    // 2. Optimize images
    await this.optimizeImages()
    
    // 3. Minimize render-blocking resources
    await this.minimizeRenderBlocking()
    
    // 4. Optimize server response time
    await this.optimizeServerResponse()
  }

  private static async preloadCriticalResources(): Promise<void> {
    // Preload critical CSS and fonts
    const criticalResources = [
      '/src/styles/base.css',
      '/src/styles/components.css',
      '/fonts/inter-var.woff2'
    ]
    
    for (const resource of criticalResources) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource
      link.as = resource.endsWith('.css') ? 'style' : 'font'
      document.head.appendChild(link)
    }
  }

  private static async optimizeImages(): Promise<void> {
    // Use WebP format with fallbacks
    const images = document.querySelectorAll('img')
    for (const img of images) {
      if (img.dataset.src) {
        img.src = img.dataset.src
        img.loading = 'lazy'
      }
    }
  }
}
```

### FID (First Input Delay)

**Target**: < 100ms

**Optimization Strategies**:

```typescript
// FID optimization
export class FIDOptimization {
  static async optimizeFID(): Promise<void> {
    // 1. Minimize JavaScript execution
    await this.minimizeJSExecution()
    
    // 2. Optimize event handlers
    await this.optimizeEventHandlers()
    
    // 3. Use passive event listeners
    await this.usePassiveListeners()
  }

  private static async minimizeJSExecution(): Promise<void> {
    // Code splitting for non-critical JavaScript
    const nonCriticalModules = [
      'analytics',
      'advanced-features',
      'admin-tools'
    ]
    
    for (const module of nonCriticalModules) {
      await import(`./modules/${module}`)
    }
  }

  private static async optimizeEventHandlers(): Promise<void> {
    // Debounce input handlers
    const debounce = (func: Function, wait: number) => {
      let timeout: NodeJS.Timeout
      return function executedFunction(...args: any[]) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    }
    
    // Apply to input fields
    const inputs = document.querySelectorAll('input, textarea')
    inputs.forEach(input => {
      input.addEventListener('input', debounce((e: Event) => {
        // Handle input
      }, 300))
    })
  }
}
```

### CLS (Cumulative Layout Shift)

**Target**: < 0.1

**Optimization Strategies**:

```typescript
// CLS optimization
export class CLSOptimization {
  static async optimizeCLS(): Promise<void> {
    // 1. Reserve space for dynamic content
    await this.reserveSpace()
    
    // 2. Optimize images with aspect ratios
    await this.optimizeImageAspectRatios()
    
    // 3. Avoid layout shifts from ads
    await this.optimizeAdPlacements()
  }

  private static async reserveSpace(): Promise<void> {
    // Reserve space for dynamic content
    const containers = document.querySelectorAll('.dynamic-content')
    containers.forEach(container => {
      container.style.minHeight = '200px'
      container.style.overflow = 'hidden'
    })
  }

  private static async optimizeImageAspectRatios(): Promise<void> {
    // Set aspect ratios for images
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      if (img.dataset.aspectRatio) {
        const aspectRatio = img.dataset.aspectRatio
        img.style.aspectRatio = aspectRatio
      }
    })
  }
}
```

## Bundle Optimization

### Code Splitting

**Configuration**: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react', 'clsx'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          maps: ['leaflet', 'react-leaflet'],
          i18n: ['react-i18next', 'i18next']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### Tree Shaking

**Implementation**:

```typescript
// Optimize imports for tree shaking
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Instead of
// import * as React from 'react'
// import * as UI from '@/components/ui'
```

### Bundle Analysis

**Tools**:
- Vite Bundle Analyzer
- Webpack Bundle Analyzer
- Rollup Plugin Visualizer

**Implementation**:

```bash
# Analyze bundle size
npm run build:analyze

# Check bundle size
npm run build
npx vite-bundle-analyzer dist
```

## Image Optimization

### WebP Format

**Implementation**:

```typescript
// Image optimization utilities
export class ImageOptimization {
  static async optimizeImage(file: File): Promise<Blob> {
    // Convert to WebP if supported
    if (this.supportsWebP()) {
      return this.convertToWebP(file)
    }
    
    // Fallback to JPEG optimization
    return this.optimizeJPEG(file)
  }

  private static supportsWebP(): boolean {
    const canvas = document.createElement('canvas')
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }

  private static async convertToWebP(file: File): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          resolve(blob!)
        }, 'image/webp', 0.8)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }
}
```

### Lazy Loading

**Implementation**:

```typescript
// Lazy loading implementation
export class LazyLoading {
  static initLazyLoading(): void {
    const images = document.querySelectorAll('img[data-src]')
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src!
          img.classList.remove('lazy')
          imageObserver.unobserve(img)
        }
      })
    })
    
    images.forEach(img => imageObserver.observe(img))
  }
}
```

## Caching Strategies

### Service Worker Caching

**Implementation**: `public/sw.js`

```javascript
const CACHE_NAME = 'mondeneigeur-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/css/main.css',
  '/static/js/main.js'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request)
      })
  )
})
```

### Browser Caching

**Configuration**:

```typescript
// Cache headers configuration
export const cacheHeaders = {
  // Static assets - 1 year
  '/static/**': {
    'Cache-Control': 'public, max-age=31536000, immutable'
  },
  
  // HTML files - no cache
  '/*.html': {
    'Cache-Control': 'public, max-age=0, must-revalidate'
  },
  
  // API responses - 5 minutes
  '/api/**': {
    'Cache-Control': 'public, max-age=300'
  }
}
```

## Database Performance

### Query Optimization

**Implementation**:

```typescript
// Optimized database queries
export class DatabaseOptimization {
  static async getEmployeesWithProfile(companyId: string): Promise<Employee[]> {
    // Use joins instead of multiple queries
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        profiles (
          id,
          full_name,
          email,
          role
        )
      `)
      .eq('company_id', companyId)
    
    if (error) throw error
    return data
  }

  static async getCompanyStats(companyId: string): Promise<CompanyStats> {
    // Use database functions for complex aggregations
    const { data, error } = await supabase
      .rpc('get_company_stats', { company_id: companyId })
    
    if (error) throw error
    return data
  }
}
```

### Indexing Strategy

**Database Indexes**:

```sql
-- Performance indexes
CREATE INDEX idx_employees_company_id ON employees(company_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_service_visits_employee_id ON service_visits(employee_id);
CREATE INDEX idx_service_visits_scheduled_date ON service_visits(scheduled_date);
CREATE INDEX idx_gps_logs_employee_id ON gps_logs(employee_id);
CREATE INDEX idx_gps_logs_timestamp ON gps_logs(timestamp);
```

## API Performance

### Request Optimization

**Implementation**:

```typescript
// Optimized API requests
export class APIOptimization {
  static async batchRequests(requests: Promise<any>[]): Promise<any[]> {
    // Batch multiple requests
    return Promise.all(requests)
  }

  static async cacheResponses<T>(
    key: string,
    request: () => Promise<T>,
    ttl: number = 300000 // 5 minutes
  ): Promise<T> {
    const cached = localStorage.getItem(key)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < ttl) {
        return data
      }
    }
    
    const data = await request()
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }))
    
    return data
  }
}
```

### React Query Optimization

**Configuration**:

```typescript
// Optimized React Query configuration
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
```

## PWA Performance

### App Shell Architecture

**Implementation**:

```typescript
// App shell optimization
export class AppShellOptimization {
  static async preloadAppShell(): Promise<void> {
    // Preload critical app shell resources
    const criticalResources = [
      '/static/css/app-shell.css',
      '/static/js/app-shell.js',
      '/manifest.json'
    ]
    
    for (const resource of criticalResources) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource
      document.head.appendChild(link)
    }
  }

  static async cacheAppShell(): Promise<void> {
    // Cache app shell in service worker
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/sw.js')
      await registration.update()
    }
  }
}
```

### Offline Performance

**Implementation**:

```typescript
// Offline performance optimization
export class OfflineOptimization {
  static async cacheCriticalData(): Promise<void> {
    // Cache critical data for offline use
    const criticalData = [
      'user-profile',
      'company-info',
      'employee-routes'
    ]
    
    for (const dataKey of criticalData) {
      const data = await this.fetchData(dataKey)
      localStorage.setItem(dataKey, JSON.stringify(data))
    }
  }

  static async syncOfflineData(): Promise<void> {
    // Sync offline data when online
    const offlineActions = JSON.parse(
      localStorage.getItem('offline-actions') || '[]'
    )
    
    for (const action of offlineActions) {
      try {
        await this.performAction(action)
        // Remove successful action
        offlineActions.splice(offlineActions.indexOf(action), 1)
      } catch (error) {
        console.error('Failed to sync action:', action, error)
      }
    }
    
    localStorage.setItem('offline-actions', JSON.stringify(offlineActions))
  }
}
```

## Monitoring & Analytics

### Performance Monitoring

**Implementation**:

```typescript
// Performance monitoring
export class PerformanceMonitoring {
  static initPerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    this.monitorWebVitals()
    
    // Monitor custom metrics
    this.monitorCustomMetrics()
    
    // Monitor errors
    this.monitorErrors()
  }

  private static monitorWebVitals(): void {
    // LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.reportMetric('LCP', lastEntry.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // FID
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const firstEntry = entries[0]
      this.reportMetric('FID', 
        firstEntry.processingStart - firstEntry.startTime
      )
    }).observe({ entryTypes: ['first-input'] })

    // CLS
    new PerformanceObserver((list) => {
      let clsValue = 0
      for (const entry of list.getEntries()) {
        clsValue += (entry as any).value
      }
      this.reportMetric('CLS', clsValue)
    }).observe({ entryTypes: ['layout-shift'] })
  }

  private static reportMetric(name: string, value: number): void {
    // Send to analytics service
    if (import.meta.env.PROD) {
      // Send to monitoring service
      console.log(`Performance metric: ${name} = ${value}`)
    }
  }
}
```

### Bundle Analysis

**Implementation**:

```typescript
// Bundle analysis
export class BundleAnalysis {
  static async analyzeBundle(): Promise<BundleReport> {
    const response = await fetch('/stats.json')
    const stats = await response.json()
    
    return {
      totalSize: stats.totalSize,
      chunks: stats.chunks,
      modules: stats.modules,
      warnings: stats.warnings
    }
  }

  static async optimizeBundle(): Promise<void> {
    const report = await this.analyzeBundle()
    
    // Identify large modules
    const largeModules = report.modules
      .filter(module => module.size > 100000)
      .sort((a, b) => b.size - a.size)
    
    // Suggest optimizations
    for (const module of largeModules) {
      console.log(`Large module: ${module.name} (${module.size} bytes)`)
    }
  }
}
```

## Performance Testing

### Lighthouse Testing

**Implementation**:

```typescript
// Lighthouse testing
export class LighthouseTesting {
  static async runLighthouseAudit(url: string): Promise<LighthouseReport> {
    // Run Lighthouse audit
    const lighthouse = require('lighthouse')
    const chromeLauncher = require('chrome-launcher')
    
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
    const options = { logLevel: 'info', output: 'json', onlyCategories: ['performance'] }
    const runnerResult = await lighthouse(url, options)
    
    await chrome.kill()
    
    return {
      performance: runnerResult.lhr.categories.performance.score * 100,
      accessibility: runnerResult.lhr.categories.accessibility.score * 100,
      bestPractices: runnerResult.lhr.categories['best-practices'].score * 100,
      seo: runnerResult.lhr.categories.seo.score * 100,
      pwa: runnerResult.lhr.categories.pwa.score * 100
    }
  }
}
```

### Load Testing

**Implementation**:

```typescript
// Load testing
export class LoadTesting {
  static async runLoadTest(url: string, concurrentUsers: number): Promise<LoadTestReport> {
    const results = []
    
    for (let i = 0; i < concurrentUsers; i++) {
      const startTime = Date.now()
      
      try {
        const response = await fetch(url)
        const endTime = Date.now()
        
        results.push({
          user: i,
          responseTime: endTime - startTime,
          status: response.status,
          success: response.ok
        })
      } catch (error) {
        results.push({
          user: i,
          responseTime: 0,
          status: 0,
          success: false,
          error: error.message
        })
      }
    }
    
    return {
      totalUsers: concurrentUsers,
      successfulRequests: results.filter(r => r.success).length,
      averageResponseTime: results.reduce((sum, r) => sum + r.responseTime, 0) / results.length,
      results
    }
  }
}
```

## Best Practices

### Development Best Practices

**1. Code Splitting**:
- Split by routes
- Split by features
- Split vendor libraries
- Lazy load non-critical components

**2. Bundle Optimization**:
- Use tree shaking
- Minimize bundle size
- Optimize imports
- Remove unused code

**3. Image Optimization**:
- Use WebP format
- Implement lazy loading
- Optimize image sizes
- Use appropriate formats

### Runtime Best Practices

**1. Caching**:
- Cache static assets
- Cache API responses
- Use service worker
- Implement offline support

**2. Database Optimization**:
- Use indexes
- Optimize queries
- Use pagination
- Implement caching

**3. API Optimization**:
- Batch requests
- Use GraphQL
- Implement caching
- Optimize payloads

### Monitoring Best Practices

**1. Performance Monitoring**:
- Monitor Core Web Vitals
- Track custom metrics
- Set up alerts
- Regular audits

**2. Error Monitoring**:
- Track JavaScript errors
- Monitor API failures
- Set up error reporting
- Analyze error patterns

**3. User Experience**:
- Monitor user interactions
- Track conversion rates
- Analyze user flows
- Optimize based on data

---

**MonDeneigeur PWA** - Comprehensive performance guide for production-ready applications. 