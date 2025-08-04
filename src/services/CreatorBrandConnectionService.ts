import { BaseService, ServiceResult } from "./base/BaseService";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

export interface CreatorApplication {
  id: string;
  campaign_id: string;
  creator_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  proposal: string;
  proposed_timeline: string;
  proposed_budget: number;
  portfolio_links: string[];
  custom_message?: string;
  match_score?: number;
  created_at: string;
  updated_at: string;
  campaign?: {
    id: string;
    name: string;
    brand_id: string;
    description: string;
    budget?: number;
  };
  creator?: {
    id: string;
    full_name: string;
    username: string;
    avatar_url?: string;
  };
}

export interface CampaignOpportunity {
  id: string;
  name: string;
  description: string;
  brand_id: string;
  budget?: number;
  categories: string[];
  requirements: string[];
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  deadline?: string;
  created_at: string;
  brand?: {
    id: string;
    company_name: string;
    logo_url?: string;
  };
  applications_count?: number;
  is_applied?: boolean;
}

export interface CreatorProfile {
  id: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  categories: string[];
  followers_count?: number;
  engagement_rate?: number;
  portfolio_items: Array<{
    id: string;
    title: string;
    media_url: string;
    view_count: number;
  }>;
  rating?: number;
  response_time?: string;
}

export class CreatorBrandConnectionService extends BaseService {
  constructor() {
    super('applications');
  }

  // Creator methods
  async getOpportunitiesForCreator(
    creatorId: string,
    filters?: {
      categories?: string[];
      budgetMin?: number;
      budgetMax?: number;
      status?: string;
    }
  ): Promise<ServiceResult<CampaignOpportunity[]>> {
    return this.executeQuery<CampaignOpportunity[]>('getOpportunitiesForCreator', async () => {
      let query = supabase
        .from('campaigns')
        .select(`
          id,
          name,
          description,
          brand_id,
          budget,
          categories,
          requirements,
          status,
          deadline,
          created_at,
          brand_profiles!inner(
            id,
            company_name,
            logo_url
          )
        `)
        .eq('status', 'active');

      // Apply filters
      if (filters?.categories && filters.categories.length > 0) {
        query = query.overlaps('categories', filters.categories);
      }

      if (filters?.budgetMin) {
        query = query.gte('budget', filters.budgetMin);
      }

      if (filters?.budgetMax) {
        query = query.lte('budget', filters.budgetMax);
      }

      const { data: campaigns, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Check which campaigns the creator has already applied to
      const { data: applications } = await supabase
        .from('applications')
        .select('campaign_id')
        .eq('creator_id', creatorId);

      const appliedCampaignIds = new Set(applications?.map(app => app.campaign_id) || []);

      // Get applications count for each campaign
      const campaignIds = campaigns?.map(c => c.id) || [];
      const { data: appCounts } = await supabase
        .from('applications')
        .select('campaign_id')
        .in('campaign_id', campaignIds);

      const applicationCounts = appCounts?.reduce((acc, app) => {
        acc[app.campaign_id] = (acc[app.campaign_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return campaigns?.map(campaign => ({
        ...campaign,
        brand: campaign.brand_profiles,
        applications_count: applicationCounts[campaign.id] || 0,
        is_applied: appliedCampaignIds.has(campaign.id)
      })) || [];
    });
  }

  async applyToCampaign(applicationData: {
    campaign_id: string;
    creator_id: string;
    proposal: string;
    proposed_timeline: string;
    proposed_budget: number;
    portfolio_links: string[];
    custom_message?: string;
  }): Promise<ServiceResult<CreatorApplication>> {
    return this.executeQuery<CreatorApplication>('applyToCampaign', async () => {
      // Check if already applied
      const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('campaign_id', applicationData.campaign_id)
        .eq('creator_id', applicationData.creator_id)
        .single();

      if (existing) {
        throw new Error('You have already applied to this campaign');
      }

      // Calculate match score (simplified algorithm)
      const matchScore = await this.calculateMatchScore(
        applicationData.creator_id,
        applicationData.campaign_id
      );

      const { data: application, error } = await supabase
        .from('applications')
        .insert({
          ...applicationData,
          match_score: matchScore,
          status: 'pending'
        })
        .select('*')
        .single();

      if (error) throw error;

      // Send notification to brand (implementation would depend on notification system)
      logger.info('New application submitted', {
        campaignId: applicationData.campaign_id,
        creatorId: applicationData.creator_id,
        matchScore
      });

      return application;
    });
  }

  async getCreatorApplications(creatorId: string): Promise<ServiceResult<CreatorApplication[]>> {
    return this.executeQuery<CreatorApplication[]>('getCreatorApplications', async () => {
      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          *,
          campaigns!inner(
            id,
            name,
            description,
            budget,
            brand_id,
            brand_profiles!inner(
              company_name
            )
          )
        `)
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return applications?.map(app => ({
        ...app,
        campaign: {
          ...app.campaigns,
          brand_name: app.campaigns.brand_profiles?.company_name
        }
      })) || [];
    });
  }

  // Brand methods
  async getCreatorsForBrand(
    brandId: string,
    filters?: {
      categories?: string[];
      followersMin?: number;
      engagementMin?: number;
      searchQuery?: string;
    }
  ): Promise<ServiceResult<CreatorProfile[]>> {
    return this.executeQuery<CreatorProfile[]>('getCreatorsForBrand', async () => {
      let query = supabase
        .from('creator_profiles')
        .select(`
          id,
          bio,
          categories,
          audience_demographics,
          profiles!inner(
            full_name,
            username,
            avatar_url
          )
        `);

      // Apply filters
      if (filters?.categories && filters.categories.length > 0) {
        query = query.overlaps('categories', filters.categories);
      }

      if (filters?.searchQuery) {
        query = query.or(`profiles.full_name.ilike.%${filters.searchQuery}%,profiles.username.ilike.%${filters.searchQuery}%`);
      }

      const { data: creators, error } = await query.limit(50);

      if (error) throw error;

      // Get portfolio items for each creator
      const creatorIds = creators?.map(c => c.id) || [];
      const { data: portfolioItems } = await supabase
        .from('portfolio_items')
        .select('creator_id, id, title, media_url, view_count')
        .in('creator_id', creatorIds);

      const portfolioByCreator = portfolioItems?.reduce((acc, item) => {
        if (!acc[item.creator_id]) acc[item.creator_id] = [];
        acc[item.creator_id].push(item);
        return acc;
      }, {} as Record<string, any[]>) || {};

      return creators?.map(creator => {
        const demographics = creator.audience_demographics || {};
        return {
          id: creator.id,
          full_name: creator.profiles.full_name,
          username: creator.profiles.username,
          avatar_url: creator.profiles.avatar_url,
          bio: creator.bio,
          categories: creator.categories || [],
          followers_count: demographics.total_followers || 0,
          engagement_rate: demographics.engagement_rate || 0,
          portfolio_items: portfolioByCreator[creator.id] || [],
          rating: 4.5, // Would come from reviews/ratings system
          response_time: '< 2 hours' // Would come from messaging analytics
        };
      }) || [];
    });
  }

  async getBrandApplications(brandId: string): Promise<ServiceResult<CreatorApplication[]>> {
    return this.executeQuery<CreatorApplication[]>('getBrandApplications', async () => {
      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          *,
          campaigns!inner(
            id,
            name,
            brand_id
          ),
          profiles!inner(
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('campaigns.brand_id', brandId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return applications?.map(app => ({
        ...app,
        creator: {
          id: app.creator_id,
          full_name: app.profiles.full_name,
          username: app.profiles.username,
          avatar_url: app.profiles.avatar_url
        }
      })) || [];
    });
  }

  async updateApplicationStatus(
    applicationId: string,
    status: 'approved' | 'rejected',
    brandId: string
  ): Promise<ServiceResult<CreatorApplication>> {
    return this.executeQuery<CreatorApplication>('updateApplicationStatus', async () => {
      // Verify brand owns the campaign
      const { data: application, error: fetchError } = await supabase
        .from('applications')
        .select(`
          *,
          campaigns!inner(brand_id)
        `)
        .eq('id', applicationId)
        .single();

      if (fetchError) throw fetchError;
      if (application.campaigns.brand_id !== brandId) {
        throw new Error('Unauthorized to update this application');
      }

      const { data: updated, error } = await supabase
        .from('applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', applicationId)
        .select('*')
        .single();

      if (error) throw error;

      // If approved, create collaboration record
      if (status === 'approved') {
        await supabase
          .from('campaign_creators')
          .insert({
            campaign_id: application.campaign_id,
            creator_id: application.creator_id,
            status: 'approved',
            agreed_budget: application.proposed_budget,
            timeline: application.proposed_timeline
          });
      }

      logger.info('Application status updated', {
        applicationId,
        status,
        brandId
      });

      return updated;
    });
  }

  // Helper methods
  private async calculateMatchScore(creatorId: string, campaignId: string): Promise<number> {
    try {
      // Get creator profile and campaign details
      const [creatorResult, campaignResult] = await Promise.all([
        supabase
          .from('creator_profiles')
          .select('categories, audience_demographics')
          .eq('id', creatorId)
          .single(),
        supabase
          .from('campaigns')
          .select('categories, budget, requirements')
          .eq('id', campaignId)
          .single()
      ]);

      if (creatorResult.error || campaignResult.error) {
        return 50; // Default score if data is missing
      }

      const creator = creatorResult.data;
      const campaign = campaignResult.data;

      let score = 0;

      // Category match (40% weight)
      const creatorCategories = creator.categories || [];
      const campaignCategories = campaign.categories || [];
      const categoryOverlap = creatorCategories.filter(cat => 
        campaignCategories.includes(cat)
      ).length;
      
      if (campaignCategories.length > 0) {
        score += (categoryOverlap / campaignCategories.length) * 40;
      }

      // Audience size match (30% weight)
      const audience = creator.audience_demographics?.total_followers || 0;
      const budget = campaign.budget || 0;
      
      if (audience > 0 && budget > 0) {
        // Simplified: better match if audience size aligns with budget
        const audienceScore = Math.min(audience / 10000, 10) / 10; // Normalize
        const budgetScore = Math.min(budget / 1000, 10) / 10; // Normalize
        score += Math.abs(audienceScore - budgetScore) < 0.3 ? 30 : 15;
      }

      // Engagement rate (20% weight)
      const engagementRate = creator.audience_demographics?.engagement_rate || 0;
      if (engagementRate > 3) score += 20;
      else if (engagementRate > 2) score += 15;
      else if (engagementRate > 1) score += 10;

      // Portfolio completeness (10% weight)
      // This would check if creator has portfolio items
      score += 10; // Simplified

      return Math.round(Math.min(score, 100));
    } catch (error) {
      logger.error('Error calculating match score', error);
      return 50; // Default score on error
    }
  }
}