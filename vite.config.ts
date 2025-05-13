import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: '/Gym_julian/',
  build: {
    outDir: 'docs', // Cambiado a 'docs' para GitHub Pages
    emptyOutDir: true,
  },
});