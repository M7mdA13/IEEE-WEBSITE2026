import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Converts Vite's injected <link rel="stylesheet"> for the main CSS bundle
// into an async preload so it no longer blocks initial render.
const asyncMainCss = {
  name: 'async-main-css',
  transformIndexHtml(html) {
    return html.replace(
      /<link rel="stylesheet" crossorigin href="(\/assets\/index-[^"]+\.css)">/g,
      (_, href) =>
        `<link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" href="${href}">` +
        `<noscript><link rel="stylesheet" href="${href}"></noscript>`
    );
  },
};

export default defineConfig({
  plugins: [react(), asyncMainCss],
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
