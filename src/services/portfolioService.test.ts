
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
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn(),
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
      const mockResponse = { data: mockPortfolioItems, error: null };
      supabase.select.mockImplementation(() => ({ order: () => mockResponse }));

      const result = await getPortfolioItems('test-creator-id');
      
      expect(result).toEqual(mockPortfolioItems);
      expect(supabase.from).toHaveBeenCalledWith('portfolio_items');
      expect(supabase.select).toHaveBeenCalledWith('*');
      expect(supabase.eq).toHaveBeenCalledWith('creator_id', 'test-creator-id');
    });

    it('should throw error when Supabase returns an error', async () => {
      const mockError = new Error('Database error');
      supabase.select.mockImplementation(() => ({ 
        order: () => ({ data: null, error: mockError }) 
      }));

      await expect(getPortfolioItems('test-creator-id')).rejects.toThrow();
    });
  });

  describe('createPortfolioItem', () => {
    it('should create a new portfolio item', async () => {
      const newItem = { title: 'New Portfolio', description: 'Test description' };
      const createdItem = { ...newItem, id: '3', creator_id: 'test-creator-id' };
      
      supabase.insert.mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: createdItem, error: null })
        })
      });

      const result = await createPortfolioItem('test-creator-id', newItem);
      
      expect(result).toEqual(createdItem);
      expect(supabase.from).toHaveBeenCalledWith('portfolio_items');
      expect(supabase.insert).toHaveBeenCalledWith([{ ...newItem, creator_id: 'test-creator-id' }]);
    });
  });

  describe('toggleFeaturedStatus', () => {
    it('should update the featured status of an item', async () => {
      supabase.update.mockReturnValue({ data: null, error: null });

      await toggleFeaturedStatus('1', true);
      
      expect(supabase.from).toHaveBeenCalledWith('portfolio_items');
      expect(supabase.update).toHaveBeenCalledWith({ is_featured: true });
      expect(supabase.eq).toHaveBeenCalledWith('id', '1');
    });
  });
});
