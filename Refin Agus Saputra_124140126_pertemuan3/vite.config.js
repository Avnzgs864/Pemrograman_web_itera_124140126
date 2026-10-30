import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Konfigurasi Vitest untuk unit testing (Vitest + React Testing Library)
  test: {
    environment: 'jsdom', // simulasi DOM browser untuk testing
    globals: true, // describe / it / expect tersedia secara global
    setupFiles: './src/setupTests.js', // file setup jest-dom matchers
  },
})
