
import { describe, it, expect, vi } from 'vitest';
import { handleError, categorizeError, showErrorToast, ErrorCategory } from './errorHandling';
import { toast } from '@/hooks/use-toast';

// Mock dependencies
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

describe('Error Handling Library', () => {
  it('should categorize network errors correctly', () => {
    // Mock navigator.onLine to be false
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
    
    const category = categorizeError(new Error('Network error'));
    expect(category).toBe(ErrorCategory.NETWORK);
    
    // Reset navigator.onLine
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
  });

  it('should categorize auth errors correctly', () => {
    const authError = { code: 'auth/invalid-email', message: 'Invalid email' };
    const category = categorizeError(authError);
    expect(category).toBe(ErrorCategory.AUTH);
  });

  it('should create structured AppError objects', () => {
    const error = new Error('Test error');
    const appError = handleError(error, 'Context message');
    
    expect(appError.message).toContain('Context message');
    expect(appError.originalError).toBe(error);
    expect(appError.category).toBeDefined();
    expect(appError.context).toBeDefined();
  });

  it('should show error toast with correct message', () => {
    const appError = {
      message: 'Test error message',
      category: ErrorCategory.VALIDATION,
      code: 'TEST_CODE'
    };
    
    showErrorToast(appError);
    
    expect(toast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Test error message',
      variant: 'destructive'
    });
  });
});
