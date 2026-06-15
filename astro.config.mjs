import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://blog.heyanto.fr',
  integrations: [mdx(), sitemap()],
  output: 'static',
});
