
import { supabase } from "@/integrations/supabase/client";
import { handleServiceRequest } from "@/lib/errorHandling";

// Fetch campaigns for a brand
export async function getBrandCampaigns(brandId: string) {
  return handleServiceRequest('getBrandCampaigns', async () => {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });
}

// Update a campaign
export async function updateCampaign(campaignId: string, update: Record<string, any>) {
  return handleServiceRequest('updateCampaign', async () => {
    const { error } = await supabase
      .from("campaigns")
      .update(update)
      .eq("id", campaignId);
    if (error) throw error;
    return true;
  });
}
