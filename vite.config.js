import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React — tiny, cached forever
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Animation — used on every page but large
          'vendor-motion': ['framer-motion'],
          // 3D / animation libs — only needed on About page
          'vendor-three': ['three'],
          'vendor-gsap':  ['gsap'],
        },
      },
    },
  },
})
