
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './auth';
import { handleError } from './auth';

describe('Auth Utils', () => {
  it('should handle errors correctly', () => {
    const testError = new Error('Test auth error');
    const result = handleError(testError);
    expect(result.error).toBe('Test auth error');
  });
});

describe('Auth Store', () => {
  let store: ReturnType<typeof useAuthStore.getState>;

  beforeEach(() => {
    useAuthStore.setState({ user: null, session: null });
    store = useAuthStore.getState();
  });

  it('should initialize with null user and session', () => {
    expect(store.user).toBeNull();
    expect(store.session).toBeNull();
  });

  it('should set user correctly', () => {
    const mockUser = { id: 'test-id', email: 'test@example.com' } as any;
    store.setUser(mockUser);
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('should set session correctly', () => {
    const mockSession = { 
      access_token: 'test-token',
      user: { id: 'test-id' }
    } as any;
    store.setSession(mockSession);
    expect(useAuthStore.getState().session).toEqual(mockSession);
  });
});
