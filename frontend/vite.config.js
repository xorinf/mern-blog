import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': 'http://localhost:6767',
      '/user-api': 'http://localhost:6767',
      '/author-api': 'http://localhost:6767',
      '/admin-api': 'http://localhost:6767',
    }
  }
})
