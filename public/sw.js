const CACHE_NAME = 'mondeneigeur-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg'
]

// Helper function to check if URL should be cached
function shouldCacheRequest(request) {
  const url = new URL(request.url)
  
  // Don't cache chrome-extension, moz-extension, or other browser extension URLs
  if (url.protocol === 'chrome-extension:' || 
      url.protocol === 'moz-extension:' || 
      url.protocol === 'chrome:' ||
      url.protocol === 'about:' ||
      url.protocol === 'data:') {
    return false
  }
  
  // Don't cache API calls or external services
  if (url.hostname.includes('supabase.co') || 
      url.pathname.includes('/api/') ||
      url.hostname.includes('localhost') && url.port === '5173') {
    return false
  }
  
  // Only cache GET requests
  if (request.method !== 'GET') {
    return false
  }
  
  return true
}

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and unsupported URLs
  if (!shouldCacheRequest(event.request)) {
    return
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then((response) => {
            // Check if response is valid before caching
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            
            // Clone the response
            const responseToCache = response.clone()
            
            // Only cache if it's a valid request
            if (shouldCacheRequest(event.request)) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache)
                })
                .catch((error) => {
                  console.warn('Failed to cache request:', error)
                })
            }
            
            return response
          })
          .catch((error) => {
            console.warn('Fetch failed:', error)
            return new Response('Network error', { status: 503 })
          })
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // TODO: Implement background sync for offline data
      console.log('Background sync triggered')
    )
  }
})

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from MonDeneigeur',
    icon: '/vite.svg',
    badge: '/vite.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/vite.svg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/vite.svg'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('MonDeneigeur', options)
  )
})

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
}) 