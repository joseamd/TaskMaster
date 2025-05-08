import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // asegura que el build vaya a frontend/dist
  },
  root: '.',  // raíz del proyecto de frontend
  publicDir: 'public',
})
