import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: '/Gym_julian_2/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});