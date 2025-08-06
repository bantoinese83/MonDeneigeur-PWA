/**
 * Cache clearing utilities for development
 */

export const clearServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
        console.log('Service worker unregistered')
      }
    } catch (error) {
      console.warn('Failed to unregister service worker:', error)
    }
  }
}

export const clearBrowserCache = async () => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      console.log('Browser cache cleared')
    } catch (error) {
      console.warn('Failed to clear browser cache:', error)
    }
  }
}

export const reloadWithoutCache = () => {
  // Force reload without cache
  window.location.reload()
}

export const initializeDevHelpers = () => {
  if (import.meta.env.DEV) {
    // Add global helper for development
    ;(window as any).devHelpers = {
      clearCache: clearBrowserCache,
      clearSW: clearServiceWorker,
      reload: reloadWithoutCache
    }
    
    console.log('🔧 Dev helpers available: window.devHelpers')
  }
} 