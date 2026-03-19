import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// proxy para a API na porta 3000 também pode ser útil depois
export default defineConfig({
  plugins: [react()],
  server: { port: 5174 }
})
