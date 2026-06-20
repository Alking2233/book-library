import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: '/',
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 1500, // زيادة الحد إلى 1000 KB
  },
})