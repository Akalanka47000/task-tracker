import { default as tsconfigPaths } from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { default as react } from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  preview: {
    host: true,
    port: 5173
  },
  test: {
    environment: 'happy-dom'
  }
});
