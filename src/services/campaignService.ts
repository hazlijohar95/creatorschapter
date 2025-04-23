
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

// Update the getCreatorApplications function to include the new columns
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
