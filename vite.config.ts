import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // 同一份静态产物可部署到域名根目录或 CloudBase 子目录。
  base: './',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1100 },
  server: { port: 5173, strictPort: true },
});
