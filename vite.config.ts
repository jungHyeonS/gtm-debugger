import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    crx({ manifest })
  ],
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});
