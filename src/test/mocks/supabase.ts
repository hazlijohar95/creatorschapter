
import { vi } from 'vitest';

// Base mock for Supabase client operations
export const createSupabaseMock = () => {
  // Create mock chain builders that maintain method chaining
  const createChainMock = () => {
    const chainMock: any = {};
    const methods = [
      'from', 'select', 'eq', 'neq', 'gt', 'gte', 'lt', 'lte',
      'like', 'ilike', 'is', 'in', 'contains', 'containedBy',
      'range', 'textSearch', 'filter', 'order', 'limit',
      'single', 'maybeSingle', 'insert', 'upsert', 'update', 'delete'
    ];

    methods.forEach(method => {
      chainMock[method] = vi.fn().mockImplementation(() => chainMock);
    });

    // Add response mock for the end of chains
    chainMock.mockResponse = (data: any, error: any = null) => {
      chainMock.data = data;
      chainMock.error = error;
      
      // For each method, return the chain with data/error
      methods.forEach(method => {
        chainMock[method].mockImplementation(() => chainMock);
      });
      
      // Mock the final promise resolution
      chainMock.then = (callback: any) => Promise.resolve(callback({ data, error }));
      chainMock.catch = (callback: any) => Promise.resolve({ data, error });
      return chainMock;
    };

    return chainMock;
  };

  const chainMock = createChainMock();

  // Mock supabase client
  const supabaseMock = {
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
    from: vi.fn().mockImplementation(() => chainMock),
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
    mockDataResponse: (data: any, error = null) => {
      chainMock.mockResponse(data, error);
      return chainMock;
    },
    // Helper for setting auth state
    mockAuthSession: (session: any) => {
      const auth = { auth: { getSession: vi.fn().mockResolvedValue({ data: { session } }) } };
      return auth;
    },
    // Helper to reset all mocks
    resetMocks: () => {
      vi.resetAllMocks();
      return chainMock.mockResponse(null, null);
    }
  };

  return supabaseMock;
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
