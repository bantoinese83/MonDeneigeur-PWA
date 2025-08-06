import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/i18n'
import './lib/polyfills' // Import polyfills first
import { initializeLanguage } from './lib/i18n'
import { initializeDevHelpers } from './lib/cache-clear'

// Initialize language preferences
initializeLanguage()

// Initialize development helpers
initializeDevHelpers()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
