import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/your-energy/',
  build: {
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        favorites: resolve(__dirname, 'src/favorites.html'),
      },
    },
  },
  root: 'src',
});
