/**
 * Performance monitoring and optimization utilities
 */

import { logger } from './logger';

// Web Vitals monitoring
export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
}

// Performance thresholds based on Web Vitals
const PERFORMANCE_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

export function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
  if (!thresholds) return 'good';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

// Image lazy loading optimization
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (!('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}

// Memory usage monitoring
export function logMemoryUsage(): void {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    logger.debug('Memory usage', {
      used: Math.round(memory.usedJSHeapSize / 1048576),
      total: Math.round(memory.totalJSHeapSize / 1048576),
      limit: Math.round(memory.jsHeapSizeLimit / 1048576),
    });
  }
}

// Bundle analysis helper
export function analyzeChunkLoading(): void {
  if (import.meta.env.DEV) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          logger.debug('Navigation timing', {
            dns: entry.domainLookupEnd - entry.domainLookupStart,
            connect: entry.connectEnd - entry.connectStart,
            ttfb: entry.responseStart - entry.requestStart,
            download: entry.responseEnd - entry.responseStart,
            domLoad: entry.domContentLoadedEventEnd - entry.navigationStart,
            windowLoad: entry.loadEventEnd - entry.navigationStart,
          });
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });
  }
}

// React component performance monitoring
export function withPerformanceMonitoring<T extends Record<string, any>>(
  WrappedComponent: React.ComponentType<T>,
  componentName: string
): React.ComponentType<T> {
  return function PerformanceMonitoredComponent(props: T) {
    React.useEffect(() => {
      const start = performance.now();
      
      return () => {
        const end = performance.now();
        const renderTime = end - start;
        
        if (renderTime > 16) { // Slower than 60fps
          logger.warn(`Slow component render: ${componentName}`, {
            renderTime: Math.round(renderTime),
            component: componentName,
          });
        }
      };
    });

    return React.createElement(WrappedComponent, props);
  };
}

// Resource preloading
export function preloadResource(href: string, as: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

// Critical resource hints
export function addResourceHints(): void {
  // Preconnect to Supabase
  const preconnectSupabase = document.createElement('link');
  preconnectSupabase.rel = 'preconnect';
  preconnectSupabase.href = 'https://xceitaturyhtqzuoibrd.supabase.co';
  document.head.appendChild(preconnectSupabase);

  // DNS prefetch for common domains
  const dnsPrefetchDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
}

// Initialize performance monitoring
export function initPerformanceMonitoring(): void {
  if (import.meta.env.PROD) {
    // Add resource hints
    addResourceHints();
    
    // Monitor navigation timing
    analyzeChunkLoading();
    
    // Log memory usage periodically
    setInterval(logMemoryUsage, 30000); // Every 30 seconds
  }
}