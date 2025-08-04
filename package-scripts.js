const { series, concurrent, rimraf } = require('nps-utils');

module.exports = {
  scripts: {
    default: 'nps dev',
    
    // Development
    dev: 'vite',
    'dev:host': 'vite --host',
    'dev:https': 'vite --https',
    
    // Building
    build: series(
      'nps clean',
      'nps type-check',
      'vite build',
      'nps pwa.generate-icons',
      'nps pwa.validate'
    ),
    'build:analyze': series('nps build', 'npx vite-bundle-analyzer'),
    
    // Testing
    test: 'vitest',
    'test:ui': 'vitest --ui',
    'test:run': 'vitest run',
    'test:coverage': 'vitest run --coverage',
    'test:e2e': 'playwright test',
    'test:e2e:ui': 'playwright test --ui',
    
    // Code Quality
    lint: concurrent({
      js: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
      types: 'tsc --noEmit',
    }),
    'lint:fix': 'eslint . --ext ts,tsx --fix',
    'type-check': 'tsc --noEmit',
    
    // Utilities
    clean: rimraf('dist'),
    preview: 'vite preview',
    
    // PWA specific scripts
    pwa: {
      'generate-icons': 'node scripts/generate-pwa-icons.js',
      validate: 'node scripts/validate-pwa.js',
      'audit': 'lighthouse http://localhost:4173 --preset=desktop --chrome-flags="--headless" --output=html --output-path=./lighthouse-report.html',
      'test-offline': 'node scripts/test-offline.js'
    },
    
    // Deployment
    deploy: {
      staging: series('nps build', 'gh-pages -d dist -r staging'),
      production: series('nps build', 'gh-pages -d dist'),
    },
    
    // Performance
    analyze: 'npx vite-bundle-analyzer',
    'lighthouse': 'lighthouse http://localhost:4173 --view',
    
    // Database
    db: {
      reset: 'supabase db reset',
      push: 'supabase db push',
      pull: 'supabase db pull',
      'generate-types': 'supabase gen types typescript --linked > src/integrations/supabase/types.ts'
    }
  }
};