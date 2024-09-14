import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://leavemanagement-cdx0.onrender.com/',  // Replace with your backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),  // Optional rewrite
      }
    }
  }
})