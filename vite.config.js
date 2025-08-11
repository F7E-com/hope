import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.', // If index.html is in 'hope'
  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, 'midnight-ui/src/styles'),
    },
  },
  build: {
    outDir: 'dist',
  },
});