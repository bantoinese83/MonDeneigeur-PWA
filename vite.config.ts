import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'analyze' && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ].filter(Boolean),
  
  // Performance optimizations
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
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
  },
  
  // Development optimizations with WebSocket fixes
  server: {
    port: 5173,
    host: 'localhost', // Use localhost instead of 127.0.0.1
    strictPort: false,
    hmr: {
      port: 5173,
      host: 'localhost',
      protocol: 'ws',
      timeout: 30000,
      overlay: true
    },
    watch: {
      usePolling: false,
      interval: 100
    }
  },
  
  // Preview server for testing production build
  preview: {
    port: 4173,
    host: true
  },
  
  // CSS configuration
  css: {
    devSourcemap: true
  },
  
  // Resolve aliases for better imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@stores': resolve(__dirname, 'src/stores')
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      'lucide-react',
      'clsx',
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
      'leaflet',
      'react-leaflet',
      'react-i18next',
      'i18next',
      'zustand'
    ]
  },
  
  // TypeScript configuration
  esbuild: {
    target: 'esnext'
  }
}))
