import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'), // React popup UI
        content: resolve(__dirname, 'src/content-script/content.ts'),
        background: resolve(__dirname, 'src/background/background.ts'),
        inject: resolve(__dirname, 'src/content-script/inject.js'),
      },
      output: {
        entryFileNames: (chunk) => {
          if (['content', 'background', 'inject'].includes(chunk.name)) {
            return '[name].js';
          }
          return 'assets/[name].js';
        },
      },
    },
  },
});
