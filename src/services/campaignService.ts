
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
