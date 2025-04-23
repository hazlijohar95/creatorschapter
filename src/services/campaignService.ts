
import { supabase } from "@/integrations/supabase/client";

// Update the getBrandApplications function to include the new columns
export async function getBrandApplications(brandId: string, statusFilter?: string) {
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

// Add missing functions for OpportunityDiscovery component
export async function getPublicCampaigns({ search = '' }: { search?: string } = {}) {
  let query = supabase
    .from("campaigns")
    .select(`
      id,
      name, 
      description,
      budget,
      start_date,
      end_date,
      categories,
      status,
      profiles!inner(
        full_name,
        username
      )
    `)
    .eq("status", "active");
  
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function applyToCampaign(campaignId: string, creatorId: string, applicationMessage: string) {
  const { data, error } = await supabase
    .from("campaign_creators")
    .insert({
      campaign_id: campaignId,
      creator_id: creatorId,
      application_message: applicationMessage,
      status: 'pending'
    })
    .select();
  
  if (error) throw error;
  return data;
}

export async function hasAppliedToCampaign(campaignId: string, creatorId: string) {
  const { data, error } = await supabase
    .from("campaign_creators")
    .select("*")
    .eq("campaign_id", campaignId)
    .eq("creator_id", creatorId)
    .single();
  
  if (error) {
    // If no record found, return that the creator hasn't applied
    if (error.code === 'PGRST116') {
      return { hasApplied: false, status: null };
    }
    throw error;
  }
  
  return { hasApplied: true, status: data.status };
}

export async function updateApplicationStatus(applicationId: string, status: string, brandResponse?: string) {
  const { data, error } = await supabase
    .from("campaign_creators")
    .update({ 
      status, 
      brand_response: brandResponse 
    })
    .eq("id", applicationId)
    .select();
  
  if (error) throw error;
  return data;
}
