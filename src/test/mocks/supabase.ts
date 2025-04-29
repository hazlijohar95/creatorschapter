
import { vi } from 'vitest';

// Base mock for Supabase client operations
export const createSupabaseMock = () => {
  // Base mock with common methods
  const baseMock = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnThis(),
    containedBy: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    textSearch: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
  };

  // Mock supabase client
  return {
    // Auth mocks
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    // Data mocks
    from: vi.fn().mockImplementation((table) => ({
      ...baseMock,
      insert: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    })),
    // Storage mocks
    storage: {
      from: vi.fn().mockImplementation((bucket) => ({
        upload: vi.fn(),
        download: vi.fn(),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: `https://example.com/${bucket}/test-file` } }),
        list: vi.fn(),
        remove: vi.fn(),
      })),
      createBucket: vi.fn(),
      getBucket: vi.fn(),
      listBuckets: vi.fn(),
      deleteBucket: vi.fn(),
    },
    // Helper to set return values for common operations
    mockDataResponse: (data, error = null) => {
      baseMock.select.mockReturnValue({
        data,
        error,
        count: Array.isArray(data) ? data.length : (data ? 1 : 0)
      });
      return baseMock;
    },
    // Helper for setting auth state
    mockAuthSession: (session) => {
      const auth = { auth: { getSession: vi.fn().mockResolvedValue({ data: { session } }) } };
      return auth;
    }
  };
};

// Mock the entire supabase module
export const mockSupabaseModule = () => {
  const mock = createSupabaseMock();
  
  vi.mock('@/integrations/supabase/client', () => ({
    supabase: mock
  }));
  
  return mock;
};

// Reset all mocks
export const resetSupabaseMocks = () => {
  vi.resetModules();
};
