import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// `base` targets GitHub Pages project hosting (served from /quirk/) for production
// builds, and stays at '/' during dev so the local server works normally.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/quirk/' : '/',
  plugins: [react(), tailwindcss()],
}))
