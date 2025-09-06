import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Nexus Dating App',
        short_name: 'Nexus',
        description: 'La plateforme de rencontres du futur',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'src/assets/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'src/assets/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.nexus\.com\/api\/v1\/config/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'nexus-config',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 // 24 heures
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\.nexus\.com\/api\/v1\/discovery/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'nexus-discovery',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 heures
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173
  }
});