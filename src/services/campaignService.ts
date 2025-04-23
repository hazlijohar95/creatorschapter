
import { supabase } from "@/integrations/supabase/client";

// Fetch campaigns for a brand
export async function getBrandCampaigns(brandId: string) {
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Fetch publicly available campaigns for creators to discover
export async function getPublicCampaigns(filters?: {
  categories?: string[];
  minBudget?: number;
  status?: string;
  search?: string;
}) {
  let query = supabase
    .from("campaigns")
    .select(`
      *,
      profiles!campaigns_brand_id_fkey(full_name, username)
    `)
    .eq("status", "active");
    
  if (filters?.categories && filters.categories.length > 0) {
    query = query.contains('categories', filters.categories);
  }
  
  if (filters?.minBudget) {
    query = query.gte('budget', filters.minBudget);
  }
  
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Get campaign details by ID
export async function getCampaignById(campaignId: string) {
  const { data, error } = await supabase
    .from("campaigns")
    .select(`
      *,
      profiles!campaigns_brand_id_fkey(full_name, username)
    `)
    .eq("id", campaignId)
    .single();
  
  if (error) throw error;
  return data;
}

// Update a campaign
export async function updateCampaign(campaignId: string, update: Record<string, any>) {
  const { error } = await supabase
    .from("campaigns")
    .update(update)
    .eq("id", campaignId);
  if (error) throw error;
}

// Create campaign application
export async function applyToCampaign(campaignId: string, creatorId: string, message: string) {
  const { data, error } = await supabase
    .from("campaign_creators")
    .insert({
      campaign_id: campaignId,
      creator_id: creatorId,
      application_message: message,
      status: "pending"
    })
    .select();
  
  if (error) throw error;
  return data[0];
}

// Check if creator has applied to a campaign
export async function hasAppliedToCampaign(campaignId: string, creatorId: string) {
  const { data, error } = await supabase
    .from("campaign_creators")
    .select("id, status")
    .eq("campaign_id", campaignId)
    .eq("creator_id", creatorId)
    .maybeSingle();
  
  if (error) throw error;
  return { 
    hasApplied: !!data, 
    status: data?.status || null,
    applicationId: data?.id || null
  };
}

// Get applications for a brand's campaigns
export async function getBrandApplications(brandId: string, statusFilter?: string) {
  let query = supabase
    .from("campaign_creators")
    .select(`
      id,
      status,
      application_message,
      created_at,
      campaigns!inner(
        id,
        name,
        brand_id
      ),
      profiles!inner(
        id,
        full_name,
        username,
        avatar_url
      )
    `)
    .eq("campaigns.brand_id", brandId);
  
  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Update application status
export async function updateApplicationStatus(applicationId: string, status: string, brandResponse?: string) {
  const update: Record<string, any> = { status };
  if (brandResponse) {
    update.brand_response = brandResponse;
  }
  
  const { error } = await supabase
    .from("campaign_creators")
    .update(update)
    .eq("id", applicationId);
  
  if (error) throw error;
}

// Get creator's applications
export async function getCreatorApplications(creatorId: string, statusFilter?: string) {
  let query = supabase
    .from("campaign_creators")
    .select(`
      id,
      status,
      application_message,
      brand_response,
      created_at,
      campaigns!inner(
        id,
        name,
        description,
        budget,
        end_date
      ),
      profiles!campaigns_brand_id_fkey(
        id,
        full_name,
        username
      )
    `)
    .eq("creator_id", creatorId);
  
  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
