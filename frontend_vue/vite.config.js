import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const API_ADDRESS = process.env.VUE_HOST ?? 'localhost'
const API_PORT = process.env.VUE_PORT ?? 8000

console.log(`Vite server running at http://${API_ADDRESS}:${API_PORT}`)

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: API_ADDRESS,
    port: API_PORT
  }
})
