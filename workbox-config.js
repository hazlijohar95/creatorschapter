module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,woff,woff2,ttf,eot,json}'
  ],
  swDest: 'dist/sw-generated.js',
  swSrc: 'public/sw.js',
  mode: 'production',
  
  // Runtime caching strategies
  runtimeCaching: [
    {
      // Cache API calls to Supabase
      urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-api',
        networkTimeoutSeconds: 3,
        cacheableResponse: {
          statuses: [0, 200]
        },
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 // 24 hours
        }
      }
    },
    {
      // Cache Supabase Auth requests
      urlPattern: /^https:\/\/.*\.supabase\.co\/auth\/v1\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-auth',
        networkTimeoutSeconds: 3,
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // Cache images
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // Cache CSS and JS files
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // Cache Google Fonts
      urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets'
      }
    },
    {
      // Cache Google Fonts webfonts
      urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      // Cache navigation requests
      urlPattern: /^https:\/\/.*\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'navigation',
        networkTimeoutSeconds: 3,
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    }
  ],
  
  // Skip waiting and claim clients immediately
  skipWaiting: true,
  clientsClaim: true,
  
  // Clean up old caches
  cleanupOutdatedCaches: true,
  
  // Exclude files from precaching
  dontCacheBustURLsMatching: /\.\w{8}\./,
  
  // Navigation fallback for SPA
  navigationFallback: '/index.html',
  navigationFallbackDenylist: [
    /^\/_/,
    /\/[^/?]+\.[^/]+$/
  ],
  
  // Manifest transforms
  manifestTransforms: [
    (manifestEntries) => {
      const manifest = manifestEntries.map((entry) => {
        // Remove source maps from precache
        if (entry.url.endsWith('.map')) {
          return null;
        }
        return entry;
      }).filter(Boolean);
      
      return { manifest };
    }
  ]
};