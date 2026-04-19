import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/three'))          return 'vendor-three';
          if (id.includes('node_modules/gsap'))           return 'vendor-gsap';
          if (id.includes('node_modules/framer-motion'))  return 'vendor-motion';
          if (id.includes('node_modules/tsparticles') || id.includes('node_modules/@tsparticles')) return 'vendor-particles';
          if (id.includes('node_modules/react-dom'))      return 'vendor-react';
          if (id.includes('node_modules/react-router'))   return 'vendor-react';
          if (id.includes('node_modules/react/'))         return 'vendor-react';
        },
      },
    },
  },
})
