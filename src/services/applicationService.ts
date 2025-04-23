
import { supabase } from "@/integrations/supabase/client";

// Fetch applications for a brand (by brandId & optional status)
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

// Fetch applications for a creator
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

  try {
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    
    // Ensure that profiles is properly structured for each application
    return data.map(application => {
      // Make sure profiles has valid data
      if (application.profiles && typeof application.profiles === 'object' && 'id' in application.profiles) {
        return application;
      } else {
        // Create a default profiles object if it's missing or invalid
        return {
          ...application,
          profiles: {
            id: 'unknown',
            full_name: 'Unknown Brand',
            username: 'unknown'
          }
        };
      }
    });
  } catch (error) {
    console.error('Error fetching creator applications:', error);
    throw error;
  }
}

// Apply to a campaign
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

// Check if a creator has already applied to a campaign
export async function hasAppliedToCampaign(campaignId: string, creatorId: string) {
  const { data, error } = await supabase
    .from("campaign_creators")
    .select("*")
    .eq("campaign_id", campaignId)
    .eq("creator_id", creatorId)
    .maybeSingle();

  if (error) {
    // If no record found, return that the creator hasn't applied
    if (error.code === 'PGRST116') {
      return { hasApplied: false, status: null };
    }
    throw error;
  }
  if (!data) {
    return { hasApplied: false, status: null };
  }
  return { hasApplied: true, status: data.status };
}

// Update application status (brand-side)
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
