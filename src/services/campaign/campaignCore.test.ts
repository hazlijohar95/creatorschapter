import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCampaign, getBrandCampaigns, getCampaign } from './campaignCore';
import { supabase } from '@/integrations/supabase/client';
import { createSupabaseMock } from '@/test/mocks/supabase';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => {
  const mockSupabase = createSupabaseMock();
  return { supabase: mockSupabase };
});

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
      const mockFromReturn = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnValue({
          data: mockCampaigns,
          error: null
        })
      };
      
      (supabase.from as any).mockReturnValue(mockFromReturn);

      const result = await getBrandCampaigns('test-brand-id');
      
      expect(result).toEqual(mockCampaigns);
      expect(supabase.from).toHaveBeenCalledWith('campaigns');
      expect(mockFromReturn.select).toHaveBeenCalled();
      expect(mockFromReturn.eq).toHaveBeenCalledWith('brand_id', 'test-brand-id');
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

      await expect(getBrandCampaigns('test-brand-id')).rejects.toThrow();
    });
  });

  describe('getCampaign', () => {
    it('should retrieve a single campaign by ID', async () => {
      const mockFromReturn = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnValue({
          data: mockCampaigns[0],
          error: null
        })
      };
      
      (supabase.from as any).mockReturnValue(mockFromReturn);

      const result = await getCampaign('1');
      
      expect(result).toEqual(mockCampaigns[0]);
      expect(supabase.from).toHaveBeenCalledWith('campaigns');
      expect(mockFromReturn.select).toHaveBeenCalled();
      expect(mockFromReturn.eq).toHaveBeenCalledWith('id', '1');
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
      
      const mockFromReturn = {
        insert: vi.fn().mockReturnValue({
          data: null,
          error: null
        })
      };
      
      (supabase.from as any).mockReturnValue(mockFromReturn);

      await createCampaign(newCampaign);
      
      expect(supabase.from).toHaveBeenCalledWith('campaigns');
      expect(mockFromReturn.insert).toHaveBeenCalled();
      expect(mockFromReturn.insert.mock.calls[0][0][0]).toHaveProperty('name', 'New Campaign');
      expect(mockFromReturn.insert.mock.calls[0][0][0]).toHaveProperty('brand_id', 'test-brand-id');
    });
  });
});
