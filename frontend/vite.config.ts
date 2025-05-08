import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/static/',  // 👈 esto le dice a Vite que use rutas relativas al STATIC_URL de Django
  build: {
    outDir: '../frontend/dist',  // El destino de build
    emptyOutDir: true,
  },
})