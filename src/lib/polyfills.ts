// Polyfills for browser compatibility
// Based on Supabase GitHub issues: https://github.com/supabase/supabase-js/issues/113

// Polyfill for process variable
if (typeof window !== 'undefined' && !window.process) {
  ;(window as any).process = {
    env: {
      NODE_ENV: import.meta.env.MODE
    }
  }
}

// Polyfill for global variable
if (typeof window !== 'undefined' && !window.global) {
  ;(window as any).global = window
}

// Polyfill for Buffer if needed
if (typeof window !== 'undefined' && !window.Buffer) {
  ;(window as any).Buffer = {
    isBuffer: () => false
  }
} 