import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/notoow-portfolio/',
  build: {
    // 500kb warning -> increase limit (optional)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large dependencies (Three.js is huge)
          three: ['three'],
          vendor: ['react', 'react-dom', 'framer-motion'],
          drei: ['@react-three/drei', '@react-three/fiber'],
        }
      }
    }
  }
})
