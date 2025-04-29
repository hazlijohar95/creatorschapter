
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getPortfolioItems, 
  createPortfolioItem, 
  updatePortfolioItem, 
  deletePortfolioItem,
  toggleFeaturedStatus
} from './portfolioService';
import { supabase } from '@/integrations/supabase/client';
import { mockSupabaseModule } from '@/test/mocks/supabase';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => {
      return {
        select: vi.fn(() => {
          return {
            eq: vi.fn(() => {
              return {
                order: vi.fn(() => {
                  return {
                    data: null,
                    error: null
                  };
                })
              };
            })
          };
        }),
        insert: vi.fn(() => {
          return {
            select: vi.fn(() => {
              return {
                single: vi.fn(() => {
                  return {
                    data: null,
                    error: null
                  };
                })
              };
            })
          };
        }),
        update: vi.fn(() => {
          return {
            eq: vi.fn(() => {
              return {
                data: null,
                error: null
              };
            })
          };
        }),
        delete: vi.fn(() => {
          return {
            eq: vi.fn(() => {
              return {
                data: null,
                error: null
              };
            })
          };
        })
      };
    }),
    storage: {
      getBucket: vi.fn(),
      createBucket: vi.fn()
    }
  }
}));

describe('Portfolio Service', () => {
  const mockPortfolioItems = [
    { id: '1', title: 'Test Portfolio 1', is_featured: true },
    { id: '2', title: 'Test Portfolio 2', is_featured: false }
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getPortfolioItems', () => {
    it('should retrieve portfolio items for a creator', async () => {
      const mockFromReturn = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnValue({
          data: mockPortfolioItems,
          error: null
        })
      };
      
      (supabase.from as any).mockReturnValue(mockFromReturn);

      const result = await getPortfolioItems('test-creator-id');
      
      expect(result).toEqual(mockPortfolioItems);
      expect(supabase.from).toHaveBeenCalledWith('portfolio_items');
      expect(mockFromReturn.select).toHaveBeenCalledWith('*');
      expect(mockFromReturn.eq).toHaveBeenCalledWith('creator_id', 'test-creator-id');
    });

    it('should throw error when Supabase returns an error', async () => {
      const mockError = new Error('Database error');
      const mockFromReturn = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnValue({
          data: null,
          error: mockError
        })
      };
      
      (supabase.from as any).mockReturnValue(mockFromReturn);

      await expect(getPortfolioItems('test-creator-id')).rejects.toThrow();
    });
  });

  describe('createPortfolioItem', () => {
    it('should create a new portfolio item', async () => {
      const newItem = { title: 'New Portfolio', description: 'Test description' };
      const createdItem = { ...newItem, id: '3', creator_id: 'test-creator-id' };
      
      const mockFromReturn = {
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue({
              data: createdItem,
              error: null
            })
          })
        })
      };
      
      (supabase.from as any).mockReturnValue(mockFromReturn);

      const result = await createPortfolioItem('test-creator-id', newItem);
      
      expect(result).toEqual(createdItem);
      expect(supabase.from).toHaveBeenCalledWith('portfolio_items');
    });
  });

  describe('toggleFeaturedStatus', () => {
    it('should update the featured status of an item', async () => {
      const mockFromReturn = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValue({
          data: null,
          error: null
        })
      };
      
      (supabase.from as any).mockReturnValue(mockFromReturn);

      await toggleFeaturedStatus('1', true);
      
      expect(supabase.from).toHaveBeenCalledWith('portfolio_items');
      expect(mockFromReturn.update).toHaveBeenCalledWith({ is_featured: true });
      expect(mockFromReturn.eq).toHaveBeenCalledWith('id', '1');
    });
  });
});
