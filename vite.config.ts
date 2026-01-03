import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react', 'date-fns', 'chart.js', 'react-chartjs-2'],
  },
  server: {
    proxy: {
      '/v1': {
        target: 'https://router.huggingface.co',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
