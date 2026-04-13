import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    plugins: [react()],
    root: resolve(__dirname),
    // Use clean local routes in dev; keep Django static base for production build.
    base: isDev ? '/' : '/static/workshop_app/dist/',
    build: {
      outDir: resolve(__dirname, '../workshop_app/static/workshop_app/dist'),
      emptyOutDir: true,
      manifest: 'manifest.json',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/main.jsx'),
        },
      },
    },
    server: {
      port: 5173,
      origin: 'http://localhost:5173',
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
