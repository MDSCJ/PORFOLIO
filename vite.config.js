import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' keeps asset paths relative so the build works on GitHub Pages sub-paths.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
