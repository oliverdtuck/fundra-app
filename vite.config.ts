import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({
      autoCodeSplitting: true,
      target: 'react'
    }),
    react()
  ]
});
