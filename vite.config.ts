import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

// Base path comes from the environment so one build serves both hosts:
// production (domain root) builds with the default '/', the GitHub Pages test
// build uses APP_BASE=/kocaeli-social-hub/.
const base = process.env.APP_BASE || '/';

export default defineConfig(() => {
  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['images/logo/kocaeli-logo.jpeg'],
        workbox: {
          globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,ico,webp,woff,woff2}'],
          cleanupOutdatedCaches: true,
          navigateFallback: `${base}index.html`,
          runtimeCaching: [
            {
              urlPattern: ({url, sameOrigin}) =>
                sameOrigin && /\.(?:png|jpe?g|svg|gif|webp|ico)$/.test(url.pathname),
              handler: 'CacheFirst',
              options: {
                cacheName: 'hub-images',
                cacheableResponse: {statuses: [0, 200]},
                expiration: {maxEntries: 80, maxAgeSeconds: 30 * 24 * 60 * 60},
              },
            },
          ],
        },
        manifest: {
          name: 'Kocaeli Social Hub',
          short_name: 'KocaeliHub',
          description:
            'Kocaeli merkezli gençlik topluluğu: speaking club, workshop, kamp, hiking ve kültürel etkinlikler.',
          lang: 'tr',
          theme_color: '#0a0f1d',
          background_color: '#0a0f1d',
          display: 'standalone',
          start_url: base,
          scope: base,
          icons: [
            {src: `${base}pwa-192x192.png`, sizes: '192x192', type: 'image/png'},
            {src: `${base}pwa-512x512.png`, sizes: '512x512', type: 'image/png'},
            {
              src: `${base}pwa-maskable-512x512.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
