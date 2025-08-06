/**
 * WebSocket connection test utility
 * Helps debug HMR connection issues
 */

export const testWebSocketConnection = () => {
  const ws = new WebSocket('ws://localhost:5173')
  
  ws.onopen = () => {
    console.log('✅ WebSocket connection established successfully')
    ws.close()
  }
  
  ws.onerror = (error) => {
    console.error('❌ WebSocket connection failed:', error)
  }
  
  ws.onclose = () => {
    console.log('🔌 WebSocket connection closed')
  }
}

export const checkHMRStatus = () => {
  // Check if Vite HMR is available
  if (import.meta.hot) {
    console.log('✅ Vite HMR is available')
    
    import.meta.hot.on('vite:beforeUpdate', () => {
      console.log('🔄 HMR update starting...')
    })
    
    import.meta.hot.on('vite:afterUpdate', () => {
      console.log('✅ HMR update completed')
    })
  } else {
    console.warn('⚠️ Vite HMR is not available')
  }
} 