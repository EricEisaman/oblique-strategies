import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-icons',
      writeBundle() {
        // Ensure icons directory exists
        const iconsDir = resolve(__dirname, 'dist/icons');
        if (!existsSync(iconsDir)) {
          mkdirSync(iconsDir, { recursive: true });
        }

        // Copy icon files
        const iconFiles = [
          'icon-192x192.png',
          'icon-512x512.png',
          'icon-48x48.png',
          'icon-72x72.png',
          'icon-96x96.png',
          'icon-128x128.png',
          'icon-144x144.png',
          'icon-152x152.png',
          'icon-256x256.png',
          'icon-384x384.png',
        ];

        iconFiles.forEach(icon => {
          const src = resolve(__dirname, '..', 'icons_and_manifest', 'icons', icon);
          const dest = resolve(iconsDir, icon);
          if (existsSync(src)) {
            copyFileSync(src, dest);
            console.log(`✅ Copied icon: ${icon}`);
          } else {
            console.warn(`⚠️  Icon not found: ${icon}`);
          }
        });
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'icons/icon-192x192.png',
        'icons/icon-512x512.png',
        'icons/icon-256x256.png',
      ],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          // Cache API responses for offline access
          {
            urlPattern: /^https?:\/\/localhost:\d+\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Cache static assets with CacheFirst strategy
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          // Cache fonts with CacheFirst strategy
          {
            urlPattern: /\.(?:woff2?|eot|ttf|otf)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          // Cache CSS and JS files with StaleWhileRevalidate
          {
            urlPattern: /\.(?:css|js)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
        ],
        // Offline analytics
        offlineGoogleAnalytics: true,
      },
      manifest: {
        name: 'Divine',
        short_name: 'Divine',
        description: 'Divine - Becoming a Sigma Scholar - Works offline',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['creativity', 'productivity', 'utilities'],
        lang: 'en',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
        ],
        shortcuts: [
          {
            name: 'New Strategy',
            short_name: 'New',
            description: 'Get a new oblique strategy',
            url: '/?action=new',
            icons: [
              {
                src: '/icons/icon-256x256.png',
                sizes: '256x256',
              },
            ],
          },
          {
            name: 'Favorites',
            short_name: 'Favs',
            description: 'View your favorite strategies',
            url: '/?action=favorites',
            icons: [
              {
                src: '/icons/icon-256x256.png',
                sizes: '256x256',
              },
            ],
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  optimizeDeps: {
    include: ['vue', 'vuetify', 'pinia', 'axios'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
