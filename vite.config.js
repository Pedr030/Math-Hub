import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      // Arquivos que o service worker vai pré-cachear no install
      includeAssets: ['favicon/favicon.svg', 'favicon/apple-touch-icon.png'],

      // Estratégia de cache: NetworkFirst pra rotas de navegação
      // (tenta rede, cai pro cache se offline),
      // CacheFirst pra assets estáticos (JS, CSS, fontes)
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        runtimeCaching: [
          {
            // Fontes do Google — cache por 1 ano
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            // API de câmbio — NetworkFirst com fallback pro cache de 24h
            // (se offline, usa a cotação em cache; se não tiver cache, falha
            // graciosamente — o ErrorBoundary já trata isso)
            urlPattern: /^https:\/\/v6\.exchangerate-api\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'exchange-rate-api',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 5,
            },
          },
        ],
      },

      // Metadados do app instalável
      manifest: {
        name: 'Math Hub',
        short_name: 'Math Hub',
        description: 'Central de micro-ferramentas matemáticas, gratuita e open-source.',
        theme_color: '#153E6C',
        background_color: '#0A1F38',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'favicon/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'favicon/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'favicon/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
});