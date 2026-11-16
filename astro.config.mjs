// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Final domain (SP-101). Until it is connected the site also answers on *.pages.dev.
  site: 'https://andreazichittella.com',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  // Code highlighting at build time (no JavaScript in the browser), light and dark themes:
  // the dark one is switched on by the .dark class in global.css.
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: 'light' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
