/**
 * Security utilities and helpers
 */

import { logger } from './logger';

// Content Security Policy configuration
export const CSP_CONFIG = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  fontSrc: ["'self'", "https://fonts.gstatic.com"],
  imgSrc: ["'self'", "data:", "https:", "blob:"],
  connectSrc: ["'self'", "https://*.supabase.co", "wss://*.supabase.co"],
  frameAncestors: ["'none'"],
  baseSri: ["'self'"],
  formAction: ["'self'"],
  upgradeInsecureRequests: [],
};

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .trim()
    .slice(0, 1000); // Limit length
}

// HTML sanitization for rich text
export function sanitizeHTML(html: string): string {
  // In a real app, use DOMPurify or similar
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
}

// URL validation
export function isValidURL(url: string): boolean {
  try {
    const parsedURL = new URL(url);
    return ['http:', 'https:'].includes(parsedURL.protocol);
  } catch {
    return false;
  }
}

// Rate limiting helpers
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 100, windowMs = 15 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    if (!entry || now > entry.resetTime) {
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      logger.warn('Rate limit exceeded', { identifier });
      return false;
    }

    entry.count++;
    return true;
  }

  reset(identifier: string): void {
    this.limits.delete(identifier);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Clean up rate limiter every 5 minutes
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);

// File upload security
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
  ];

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size too large (max 10MB)' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' };
  }

  // Additional security check for file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm'];
  
  if (!extension || !validExtensions.includes(extension)) {
    return { valid: false, error: 'Invalid file extension' };
  }

  return { valid: true };
}

// Password strength validation
export function validatePasswordSecurity(password: string): {
  valid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 12) {
    score += 2;
  } else if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Use at least 8 characters');
  }

  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Include numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('Include special characters');

  // Common password check
  const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
  if (commonPasswords.some(p => password.toLowerCase().includes(p))) {
    score -= 2;
    feedback.push('Avoid common passwords');
  }

  return {
    valid: score >= 4 && feedback.length === 0,
    score: Math.max(0, Math.min(5, score)),
    feedback,
  };
}

// Session security
export function generateSecureToken(length = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Environment validation
export function validateEnvironment(): boolean {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    logger.error('Missing required environment variables', { missing });
    return false;
  }

  return true;
}

// Security headers validation (for client-side monitoring)
export function checkSecurityHeaders(): void {
  if (import.meta.env.PROD) {
    // Monitor security headers in production
    fetch(window.location.href, { method: 'HEAD' })
      .then(response => {
        const headers = [
          'x-frame-options',
          'x-content-type-options',
          'x-xss-protection',
          'strict-transport-security',
          'content-security-policy',
        ];

        const missing = headers.filter(header => !response.headers.get(header));
        
        if (missing.length > 0) {
          logger.warn('Missing security headers', { missing });
        }
      })
      .catch(() => {
        // Ignore fetch errors
      });
  }
}

// Initialize security monitoring
export function initSecurityMonitoring(): void {
  if (import.meta.env.PROD) {
    // Check environment variables
    if (!validateEnvironment()) {
      throw new Error('Security validation failed: Missing environment variables');
    }

    // Monitor security headers
    checkSecurityHeaders();

    // Monitor for security events
    window.addEventListener('error', (event) => {
      if (event.error && event.error.stack) {
        logger.error('JavaScript error', event.error, {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });
      }
    });

    // Monitor for CSP violations
    document.addEventListener('securitypolicyviolation', (event) => {
      logger.warn('CSP violation', {
        directive: event.violatedDirective,
        blockedUri: event.blockedURI,
        source: event.sourceFile,
        line: event.lineNumber,
      });
    });
  }
}