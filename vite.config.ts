import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {createBuildInfo} from './scripts/build-info.mjs';

export default defineConfig({
  // 同一份静态产物可部署到域名根目录或 CloudBase 子目录。
  base: './',
  plugins: [react(),{name:'build-provenance',generateBundle(){this.emitFile({type:'asset',fileName:'build-info.json',source:JSON.stringify(createBuildInfo(),null,2)})}}],
  build: { chunkSizeWarningLimit: 1100 },
  server: { port: 5173, strictPort: true },
});
