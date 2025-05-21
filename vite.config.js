import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pagesPlugin from 'vite-plugin-pages'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',

  plugins: [react(), pagesPlugin(), tailwindcss()],

  build: {
    emptyOutDir: true,
  },
})
