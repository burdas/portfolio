// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { fileURLToPath } from 'url';
import path from 'path';
import vercel from '@astrojs/vercel';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: "https://burdas-portfolio.vercel.app/",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  integrations: [icon()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './')
      }
    },
    optimizeDeps: {
      include: ['three', 'gsap']
    }
  }
});