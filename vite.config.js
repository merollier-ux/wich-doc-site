import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'favicon.ico'],
      manifest: {
        name: 'The Wich Doc',
        short_name: 'Wich Doc',
        description: 'Artisan sandwiches, fresh-baked breads, and exclusive member recipes from Parksville, BC.',
        theme_color: '#1a110d',
        background_color: '#1a110d',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        categories: ['food', 'lifestyle'],
        icons: [
          { src: 'logo.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'logo.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
        screenshots: [
          { src: 'food1.PNG', sizes: '1280x720', type: 'image/png', form_factor: 'wide', label: 'The Wich Doc Menu' },
          { src: 'food2.PNG', sizes: '640x1136', type: 'image/png', form_factor: 'narrow', label: 'The Wich Doc on Mobile' },
        ],
        shortcuts: [
          { name: 'Order Now', short_name: 'Order', url: '/order', icons: [{ src: 'logo.png', sizes: '96x96' }] },
          { name: 'Member Portal', short_name: 'Portal', url: '/portal', icons: [{ src: 'logo.png', sizes: '96x96' }] },
          { name: 'Shop', short_name: 'Shop', url: '/shop', icons: [{ src: 'logo.png', sizes: '96x96' }] },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MiB — skip the large food photos
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            // Runtime cache for large images served from the same origin
            urlPattern: /\.(?:png|PNG|jpg|JPG|jpeg|webp)$/,
            handler: 'CacheFirst',
            options: { cacheName: 'images-cache', expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 } },
          },
        ],
      },
    }),
  ],
})
