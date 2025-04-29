
import { supabase } from "@/integrations/supabase/client";
import { withErrorHandling } from "../serviceUtils";
import { Campaign, CreateCampaignData } from "@/types/domain/campaign";

export async function createCampaign(data: CreateCampaignData) {
  return withErrorHandling(async () => {
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
        status: data.status || "draft",
        content_requirements: data.contentRequirements,
        audience_requirements: data.audienceRequirements
      }]);

    if (error) throw error;
  }, "Failed to create campaign");
}

export async function getBrandCampaigns(brandId: string) {
  return withErrorHandling(async () => {
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
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Campaign[];
  }, "Failed to fetch campaigns");
}

export async function getCampaign(campaignId: string) {
  return withErrorHandling(async () => {
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
    return data as Campaign;
  }, "Failed to fetch campaign");
}
