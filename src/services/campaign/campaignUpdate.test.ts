import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateCampaign, updateCampaignStatus, deleteCampaign } from './campaignUpdate';
import { supabase } from '@/integrations/supabase/client';
import { createSupabaseMock } from '@/test/mocks/supabase';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => {
  const mockSupabase = createSupabaseMock();
  return { supabase: mockSupabase };
});

describe('Campaign Update Services', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('updateCampaign', () => {
    it('should update a campaign', async () => {
      const campaignId = 'test-campaign-id';
      const updates = {
        name: 'Updated Campaign',
        description: 'Updated description',
        budget: 1000,
        status: 'active'
      };

      const mockFromReturn = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValue({
          data: null,
          error: null
        })
      };
      
      (supabase.from as any).mockReturnValue(mockFromReturn);

      await updateCampaign(campaignId, updates);
      
      expect(supabase.from).toHaveBeenCalledWith('campaigns');
      expect(mockFromReturn.update).toHaveBeenCalled();
      expect(mockFromReturn.eq).toHaveBeenCalledWith('id', campaignId);
    });

    it('should throw error when Supabase returns an error', async () => {
      const campaignId = 'test-campaign-id';
      const updates = { name: 'Updated Campaign' };
      const mockError = new Error('Update failed');
      
      const mockFromReturn = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValue({
          data: null,
          error: mockError
        })
      };
      
      (supabase.from as any).mockReturnValue(mockFromReturn);

      await expect(updateCampaign(campaignId, updates)).rejects.toThrow();
    });
  });

  describe('updateCampaignStatus', () => {
    it('should update only the status of a campaign', async () => {
      const campaignId = 'test-campaign-id';
      const status = 'completed';

      const mockFromReturn = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValue({
          data: null,
          error: null
        })
      };
      
      (supabase.from as any).mockReturnValue(mockFromReturn);

      await updateCampaignStatus(campaignId, status);
      
      expect(supabase.from).toHaveBeenCalledWith('campaigns');
      expect(mockFromReturn.update).toHaveBeenCalledWith({ status });
      expect(mockFromReturn.eq).toHaveBeenCalledWith('id', campaignId);
    });
  });

  describe('deleteCampaign', () => {
    it('should delete a campaign', async () => {
      const campaignId = 'test-campaign-id';

      const mockFromReturn = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValue({
          data: null,
          error: null
        })
      };
      
      (supabase.from as any).mockReturnValue(mockFromReturn);

      await deleteCampaign(campaignId);
      
      expect(supabase.from).toHaveBeenCalledWith('campaigns');
      expect(mockFromReturn.delete).toHaveBeenCalled();
      expect(mockFromReturn.eq).toHaveBeenCalledWith('id', campaignId);
    });
  });
});
