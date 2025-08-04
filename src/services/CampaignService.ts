import { BaseService, ServiceResult } from "./base/BaseService";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  brand_id: string;
  budget?: number;
  categories?: string[];
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignData {
  name: string;
  description?: string;
  brand_id: string;
  budget?: number;
  categories?: string[];
  start_date?: string;
  end_date?: string;
}

export class CampaignService extends BaseService {
  constructor() {
    super('campaigns');
  }

  async findByBrandId(brandId: string): Promise<ServiceResult<Campaign[]>> {
    return this.executeQuery<Campaign[]>(`findByBrandId(${brandId})`, async () => {
      return await supabase
        .from(this.tableName)
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false });
    });
  }

  async findActiveCampaigns(): Promise<ServiceResult<Campaign[]>> {
    return this.executeQuery<Campaign[]>('findActiveCampaigns', async () => {
      return await supabase
        .from(this.tableName)
        .select(`
          id,
          name,
          description,
          budget,
          brand_id,
          created_at,
          categories,
          end_date,
          profiles!brand_id (
            full_name,
            company_name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
    });
  }

  async updateStatus(id: string, status: Campaign['status']): Promise<ServiceResult<Campaign>> {
    return this.executeQuery<Campaign>(`updateStatus(${id}, ${status})`, async () => {
      return await supabase
        .from(this.tableName)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    });
  }

  async duplicate(id: string, brandId: string): Promise<ServiceResult<Campaign>> {
    const originalResult = await this.findById<Campaign>(id);
    
    if (!originalResult.success || !originalResult.data) {
      return { success: false, error: 'Original campaign not found' };
    }

    const original = originalResult.data;
    const duplicateData: CreateCampaignData = {
      name: `${original.name} (Copy)`,
      description: original.description,
      brand_id: brandId,
      budget: original.budget,
      categories: original.categories,
      start_date: original.start_date,
      end_date: original.end_date,
    };

    return this.create<Campaign>(duplicateData);
  }

  async getCampaignMetrics(campaignId: string): Promise<ServiceResult<any>> {
    return this.executeRPC('get_campaign_metrics', { campaign_id: campaignId });
  }

  async archiveCampaign(id: string): Promise<ServiceResult<Campaign>> {
    return this.updateStatus(id, 'archived');
  }

  async pauseCampaign(id: string): Promise<ServiceResult<Campaign>> {
    return this.updateStatus(id, 'paused');
  }

  async activateCampaign(id: string): Promise<ServiceResult<Campaign>> {
    return this.updateStatus(id, 'active');
  }

  async getCampaignsByStatus(
    brandId: string, 
    status: Campaign['status']
  ): Promise<ServiceResult<Campaign[]>> {
    return this.executeQuery<Campaign[]>(`getCampaignsByStatus(${brandId}, ${status})`, async () => {
      return await supabase
        .from(this.tableName)
        .select('*')
        .eq('brand_id', brandId)
        .eq('status', status)
        .order('created_at', { ascending: false });
    });
  }

  async searchCampaigns(
    brandId: string, 
    searchTerm: string
  ): Promise<ServiceResult<Campaign[]>> {
    return this.executeQuery<Campaign[]>(`searchCampaigns(${brandId}, ${searchTerm})`, async () => {
      return await supabase
        .from(this.tableName)
        .select('*')
        .eq('brand_id', brandId)
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });
    });
  }
}

// Singleton instance
export const campaignService = new CampaignService();