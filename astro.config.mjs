import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { articleMarkup } from './src/lib/article-markup.mjs';

// Without SITE_URL the build stays private: noindex, disallow-all robots.txt, no sitemap.
const site = process.env.SITE_URL || 'http://localhost:4321';
const isPublic = !site.startsWith('http://localhost');

const unlisted = ['/legal-notice/', '/privacy/'];

// public/ copies every file into the build, so a draft's figures would ship with it.
// This drops each article image that no built page references.
const pruneDraftImages = {
  name: 'prune-draft-images',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const out = fileURLToPath(dir);
      const images = join(out, 'images', 'articles');
      if (!existsSync(images)) return;
      const built = readdirSync(out, { recursive: true })
        .filter((file) => /\.(html|xml)$/.test(file))
        .map((file) => readFileSync(join(out, file), 'utf8'))
        .join('');
      for (const file of readdirSync(images)) {
        if (!built.includes(`/images/articles/${file}`)) rmSync(join(images, file));
      }
    },
  },
};

export default defineConfig({
  site,
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [
    pruneDraftImages,
    ...(isPublic ? [sitemap({ filter: (page) => !unlisted.includes(new URL(page).pathname) })] : []),
  ],
  markdown: {
    processor: satteri({ hastPlugins: [articleMarkup] }),
    syntaxHighlight: false,
  },
});
