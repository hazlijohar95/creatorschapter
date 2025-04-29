
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withErrorHandling, isAppError, isErrorOfCategory } from './serviceUtils';
import { handleError, AppError, ErrorCategory } from '@/lib/errorHandling';

// Mock the error handling module
vi.mock('@/lib/errorHandling', () => ({
  handleError: vi.fn((error, contextMessage) => ({
    message: 'Mocked error message',
    category: ErrorCategory.UNKNOWN,
    originalError: error
  })),
  AppError: class AppError {
    constructor(
      public message: string, 
      public category: ErrorCategory, 
      public originalError?: unknown
    ) {}
  },
  ErrorCategory: {
    NETWORK: 'network',
    AUTH: 'authentication',
    PERMISSION: 'permission',
    VALIDATION: 'validation',
    NOT_FOUND: 'not_found',
    UNKNOWN: 'unknown'
  }
}));

describe('Service Utils', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('withErrorHandling', () => {
    it('should return the result when operation succeeds', async () => {
      const operation = vi.fn().mockResolvedValue({ success: true });
      const result = await withErrorHandling(operation);
      
      expect(result).toEqual({ success: true });
      expect(operation).toHaveBeenCalledTimes(1);
      expect(handleError).not.toHaveBeenCalled();
    });

    it('should handle errors when operation fails', async () => {
      const error = new Error('Test error');
      const operation = vi.fn().mockRejectedValue(error);
      
      await expect(withErrorHandling(operation, 'Test context')).rejects.toEqual({
        message: 'Mocked error message',
        category: ErrorCategory.UNKNOWN,
        originalError: error
      });
      
      expect(handleError).toHaveBeenCalledWith(error, 'Test context');
    });
  });

  describe('isAppError', () => {
    it('should identify AppError objects', () => {
      const appError = {
        category: ErrorCategory.NETWORK,
        message: 'Network error'
      };
      
      expect(isAppError(appError)).toBe(true);
      expect(isAppError(new Error('Regular error'))).toBe(false);
      expect(isAppError(null)).toBe(false);
      expect(isAppError(undefined)).toBe(false);
      expect(isAppError('string error')).toBe(false);
    });
  });

  describe('isErrorOfCategory', () => {
    it('should correctly identify error categories', () => {
      const networkError = {
        category: ErrorCategory.NETWORK,
        message: 'Network error'
      };
      
      expect(isErrorOfCategory(networkError, ErrorCategory.NETWORK)).toBe(true);
      expect(isErrorOfCategory(networkError, ErrorCategory.AUTH)).toBe(false);
      expect(isErrorOfCategory(new Error('Regular error'), ErrorCategory.NETWORK)).toBe(false);
    });
  });
});
