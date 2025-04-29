
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateCampaign, updateCampaignStatus, deleteCampaign } from './campaignUpdate';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis()
  }
}));

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

      supabase.eq.mockReturnValue({
        data: null,
        error: null
      });

      await updateCampaign(campaignId, updates);
      
      expect(supabase.from).toHaveBeenCalledWith('campaigns');
      expect(supabase.update).toHaveBeenCalledWith({
        name: 'Updated Campaign',
        description: 'Updated description',
        budget: 1000,
        status: 'active'
      });
      expect(supabase.eq).toHaveBeenCalledWith('id', campaignId);
    });

    it('should throw error when Supabase returns an error', async () => {
      const campaignId = 'test-campaign-id';
      const updates = { name: 'Updated Campaign' };
      const mockError = new Error('Update failed');
      
      supabase.eq.mockReturnValue({
        data: null,
        error: mockError
      });

      await expect(updateCampaign(campaignId, updates)).rejects.toThrow();
    });
  });

  describe('updateCampaignStatus', () => {
    it('should update only the status of a campaign', async () => {
      const campaignId = 'test-campaign-id';
      const status = 'completed';

      supabase.eq.mockReturnValue({
        data: null,
        error: null
      });

      await updateCampaignStatus(campaignId, status);
      
      expect(supabase.from).toHaveBeenCalledWith('campaigns');
      expect(supabase.update).toHaveBeenCalledWith({ status });
      expect(supabase.eq).toHaveBeenCalledWith('id', campaignId);
    });
  });

  describe('deleteCampaign', () => {
    it('should delete a campaign', async () => {
      const campaignId = 'test-campaign-id';

      supabase.eq.mockReturnValue({
        data: null,
        error: null
      });

      await deleteCampaign(campaignId);
      
      expect(supabase.from).toHaveBeenCalledWith('campaigns');
      expect(supabase.delete).toHaveBeenCalled();
      expect(supabase.eq).toHaveBeenCalledWith('id', campaignId);
    });
  });
});
