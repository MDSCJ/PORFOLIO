import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Two pages: the Windows 11 desktop (index.html) and the 3D portfolio it opens in a window (portfolio/index.html).
// base: './' keeps asset paths relative so the build works on GitHub Pages sub-paths.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        portfolio: resolve(import.meta.dirname, 'portfolio/index.html'),
      },
    },
  },
})
