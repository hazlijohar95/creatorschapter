
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCampaign, getBrandCampaigns, getCampaign } from './campaignCore';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    single: vi.fn(),
  }
}));

describe('Campaign Core Services', () => {
  const mockCampaigns = [
    { 
      id: '1', 
      name: 'Test Campaign 1', 
      description: 'Test description', 
      status: 'draft',
      brand_id: 'test-brand-id'
    },
    { 
      id: '2', 
      name: 'Test Campaign 2', 
      description: 'Another test', 
      status: 'active',
      brand_id: 'test-brand-id'
    }
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getBrandCampaigns', () => {
    it('should retrieve campaigns for a brand', async () => {
      supabase.order.mockReturnValue({
        data: mockCampaigns,
        error: null
      });

      const result = await getBrandCampaigns('test-brand-id');
      
      expect(result).toEqual(mockCampaigns);
      expect(supabase.from).toHaveBeenCalledWith('campaigns');
      expect(supabase.select).toHaveBeenCalled();
      expect(supabase.eq).toHaveBeenCalledWith('brand_id', 'test-brand-id');
    });

    it('should throw error when Supabase returns an error', async () => {
      const mockError = new Error('Database error');
      supabase.order.mockReturnValue({
        data: null,
        error: mockError
      });

      await expect(getBrandCampaigns('test-brand-id')).rejects.toThrow();
    });
  });

  describe('getCampaign', () => {
    it('should retrieve a single campaign by ID', async () => {
      supabase.single.mockReturnValue({
        data: mockCampaigns[0],
        error: null
      });

      const result = await getCampaign('1');
      
      expect(result).toEqual(mockCampaigns[0]);
      expect(supabase.from).toHaveBeenCalledWith('campaigns');
      expect(supabase.select).toHaveBeenCalled();
      expect(supabase.eq).toHaveBeenCalledWith('id', '1');
    });
  });

  describe('createCampaign', () => {
    it('should create a new campaign', async () => {
      const newCampaign = {
        brandId: 'test-brand-id',
        name: 'New Campaign',
        description: 'Test description',
        status: 'draft'
      };
      
      supabase.insert.mockReturnValue({
        data: null,
        error: null
      });

      await createCampaign(newCampaign);
      
      expect(supabase.from).toHaveBeenCalledWith('campaigns');
      expect(supabase.insert).toHaveBeenCalled();
      expect(supabase.insert.mock.calls[0][0][0]).toHaveProperty('name', 'New Campaign');
      expect(supabase.insert.mock.calls[0][0][0]).toHaveProperty('brand_id', 'test-brand-id');
    });
  });
});
