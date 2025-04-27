
import { supabase } from "@/integrations/supabase/client";

// Create a new campaign
export async function createCampaign(data: {
  brandId: string;
  name: string;
  description?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  categories?: string[];
}) {
  const { error } = await supabase
    .from("campaigns")
    .insert([{
      brand_id: data.brandId,
      name: data.name,
      description: data.description,
      budget: data.budget,
      start_date: data.startDate,
      end_date: data.endDate,
      categories: data.categories,
      status: "draft"
    }]);

  if (error) throw error;
}

// Get all campaigns for a brand
export async function getBrandCampaigns(brandId: string) {
  const { data, error } = await supabase
    .from("campaigns")
    .select(`
      id,
      name,
      description,
      budget,
      start_date,
      end_date,
      status,
      categories,
      created_at
    `)
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Get a single campaign by ID
export async function getCampaign(campaignId: string) {
  const { data, error } = await supabase
    .from("campaigns")
    .select(`
      id,
      name,
      description,
      budget,
      start_date,
      end_date,
      status,
      categories,
      created_at,
      brand_id
    `)
    .eq("id", campaignId)
    .single();

  if (error) throw error;
  return data;
}

// Update campaign
export async function updateCampaign(campaignId: string, updates: {
  name?: string;
  description?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  categories?: string[];
}) {
  const updateData = {
    name: updates.name,
    description: updates.description,
    budget: updates.budget,
    start_date: updates.startDate,
    end_date: updates.endDate,
    categories: updates.categories
  };

  const { error } = await supabase
    .from("campaigns")
    .update(updateData)
    .eq("id", campaignId);

  if (error) throw error;
}

// Update campaign status
export async function updateCampaignStatus(campaignId: string, status: string) {
  const { error } = await supabase
    .from("campaigns")
    .update({ status })
    .eq("id", campaignId);

  if (error) throw error;
}

// Delete campaign
export async function deleteCampaign(campaignId: string) {
  const { error } = await supabase
    .from("campaigns")
    .delete()
    .eq("id", campaignId);

  if (error) throw error;
}

// Get campaign metrics
export async function getCampaignMetrics(campaignId: string) {
  const { data, error } = await supabase
    .from("campaign_metrics")
    .select("*")
    .eq("campaign_id", campaignId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

// Add campaign metrics
export async function addCampaignMetrics(data: {
  campaignId: string;
  date?: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  engagementRate?: number;
  roi?: number;
}) {
  const { error } = await supabase
    .from("campaign_metrics")
    .insert([{
      campaign_id: data.campaignId,
      date: data.date || new Date().toISOString().split('T')[0],
      impressions: data.impressions,
      clicks: data.clicks,
      conversions: data.conversions,
      engagement_rate: data.engagementRate,
      roi: data.roi
    }]);

  if (error) throw error;
}

// Get campaign creators
export async function getCampaignCreators(campaignId: string) {
  const { data, error } = await supabase
    .from("campaign_creators")
    .select(`
      id,
      status,
      application_message,
      brand_response,
      profiles:creator_id(
        id,
        full_name,
        username,
        avatar_url
      )
    `)
    .eq("campaign_id", campaignId);

  if (error) throw error;
  return data;
}

// Invite creator to campaign
export async function inviteCreatorToCampaign(campaignId: string, creatorId: string, message?: string) {
  const { error } = await supabase
    .from("campaign_creators")
    .insert([{
      campaign_id: campaignId,
      creator_id: creatorId,
      status: "pending",
      brand_response: message || "We'd like to invite you to collaborate on this campaign."
    }]);

  if (error) throw error;
}

// Update creator application status
export async function updateCreatorApplicationStatus(applicationId: string, status: string, response?: string) {
  const { error } = await supabase
    .from("campaign_creators")
    .update({ 
      status, 
      brand_response: response 
    })
    .eq("id", applicationId);

  if (error) throw error;
}
