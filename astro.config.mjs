import { defineConfig } from 'astro/config';

// Mirrors the current public address so the four /work/ case-study URLs survive a future swap.
export default defineConfig({
  site: 'https://matt-rfs.github.io',
  base: '/matthew-ralph-portfolio',
  output: 'static',
  server: { port: 4331 },
  devToolbar: { enabled: false },
});
