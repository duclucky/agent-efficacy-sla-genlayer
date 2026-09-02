import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/genlayer-rpc': {
        target: 'https://studio.genlayer.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/genlayer-rpc/, '/api'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
  },
});
