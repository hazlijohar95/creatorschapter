
import { supabase } from "@/integrations/supabase/client";
import { Campaign } from "@/components/dashboard/OpportunityDiscovery/types";

interface CampaignQueryParams {
  search?: string;
  status?: string;
  category?: string;
  limit?: number;
}

// Fetch public campaigns that creators can apply to
export async function getPublicCampaigns(params: CampaignQueryParams = {}) {
  try {
    let query = supabase
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
        profiles:brand_id (
          full_name,
          username
        )
      `)
      .eq("status", params.status || "active");

    if (params.category) {
      query = query.contains('categories', [params.category]);
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching public campaigns:", error);
      return [];
    }
    
    // Filter out campaigns with invalid profiles data
    const validCampaigns = data?.filter(campaign => {
      return campaign.profiles && 
        typeof campaign.profiles === 'object' &&
        'full_name' in campaign.profiles && 
        'username' in campaign.profiles;
    }) || [];
    
    return validCampaigns;
  } catch (error) {
    console.error("Error fetching public campaigns:", error);
    return [];
  }
}

// Fetch a single campaign by ID
export async function getCampaignById(id: string) {
  try {
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
        brand_id,
        profiles:brand_id (
          full_name,
          username,
          avatar_url
        )
      `)
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching campaign details:", error);
    throw error;
  }
}
