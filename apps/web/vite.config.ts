import { defineConfig, type Plugin, type PluginOption } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const plugins: (PluginOption | Plugin)[] = [solidPlugin(), tailwindcss()];

if (process.env.NODE_ENV === 'production') {
  plugins.push(viteSingleFile());
}

export default defineConfig({
  plugins,
  build: {
    target: 'esnext',
  },
  // alias
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@assets': '/src/assets',
    },
  },
});
