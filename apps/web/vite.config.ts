import { defineConfig, type Plugin, type PluginOption } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const plugins: (PluginOption | Plugin)[] = [solidPlugin(), tailwindcss()];

if (process.env.NODE_ENV === 'production') {
  plugins.push(viteSingleFile());
}

// for gh-pages it should be same as the repo name
const base =
  process.env.NODE_ENV === 'production' ? '/pixi-v8-particle-emitter/' : '/';

export default defineConfig({
  plugins,
  base,
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
