import { BaseService, ServiceResult } from "./base/BaseService";
import { supabase } from "@/integrations/supabase/client";

export interface Application {
  id: string;
  campaign_id: string;
  creator_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  proposal?: string;
  proposed_timeline?: any;
  proposed_budget?: any;
  portfolio_links?: string[];
  custom_message?: string;
  match_score?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationData {
  campaign_id: string;
  creator_id: string;
  proposal?: string;
  proposed_timeline?: any;
  proposed_budget?: any;
  portfolio_links?: string[];
  custom_message?: string;
}

export class ApplicationService extends BaseService {
  constructor() {
    super('applications');
  }

  async findByCreatorId(creatorId: string): Promise<ServiceResult<Application[]>> {
    return this.executeQuery<Application[]>(`findByCreatorId(${creatorId})`, async () => {
      return await supabase
        .from(this.tableName)
        .select(`
          *,
          campaigns (
            id,
            name,
            description,
            brand_id,
            profiles!brand_id (
              full_name,
              company_name
            )
          )
        `)
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false });
    });
  }

  async findByCampaignId(campaignId: string): Promise<ServiceResult<Application[]>> {
    return this.executeQuery<Application[]>(`findByCampaignId(${campaignId})`, async () => {
      return await supabase
        .from(this.tableName)
        .select(`
          *,
          profiles!creator_id (
            full_name,
            username,
            avatar_url
          ),
          creator_profiles!creator_id (
            categories,
            engagement_rate
          )
        `)
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });
    });
  }

  async updateStatus(
    id: string, 
    status: Application['status'],
    brandResponse?: string
  ): Promise<ServiceResult<Application>> {
    const updateData: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };

    if (brandResponse) {
      updateData.brand_response = brandResponse;
    }

    return this.executeQuery<Application>(`updateStatus(${id}, ${status})`, async () => {
      return await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
    });
  }

  async checkExistingApplication(
    campaignId: string, 
    creatorId: string
  ): Promise<ServiceResult<Application | null>> {
    return this.executeQuery<Application | null>('checkExistingApplication', async () => {
      return await supabase
        .from(this.tableName)
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('creator_id', creatorId)
        .maybeSingle();
    });
  }

  async getApplicationsByStatus(
    campaignId: string,
    status: Application['status']
  ): Promise<ServiceResult<Application[]>> {
    return this.executeQuery<Application[]>(`getApplicationsByStatus(${campaignId}, ${status})`, async () => {
      return await supabase
        .from(this.tableName)
        .select(`
          *,
          profiles!creator_id (
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('campaign_id', campaignId)
        .eq('status', status)
        .order('created_at', { ascending: false });
    });
  }

  async addNote(applicationId: string, note: string): Promise<ServiceResult<void>> {
    return this.executeQuery<void>(`addNote(${applicationId})`, async () => {
      // This could be extended to use a separate notes table
      return await supabase
        .from(this.tableName)
        .update({
          notes: note,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);
    });
  }

  async bulkUpdateStatus(
    applicationIds: string[],
    status: Application['status']
  ): Promise<ServiceResult<void>> {
    return this.executeQuery<void>(`bulkUpdateStatus(${applicationIds.length} items)`, async () => {
      return await supabase
        .from(this.tableName)
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .in('id', applicationIds);
    });
  }

  async getApplicationStats(campaignId: string): Promise<ServiceResult<any>> {
    return this.executeRPC('get_application_stats', { campaign_id: campaignId });
  }
}

// Singleton instance
export const applicationService = new ApplicationService();