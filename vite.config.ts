import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    strictPort: false,
    /* 开发时把贴吧接口转发给 server/index.js */
    proxy: {
      '/api': 'http://127.0.0.1:5190',
      '/uploads': 'http://127.0.0.1:5190',
    },
    watch: {
      ignored: [
        '**/shots/**',
        '**/.edge-profile/**',
        '**/dist/**',
        '**/.*.tmpdir/**',
        '**/*.tmp',
      ],
    },
  },
  preview: {
    port: 5181,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 900,
  },
});
