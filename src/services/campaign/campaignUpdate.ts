
import { supabase } from "@/integrations/supabase/client";
import { withErrorHandling } from "../serviceUtils";
import { UpdateCampaignData } from "@/types/domain/campaign";

export async function updateCampaign(campaignId: string, updates: UpdateCampaignData) {
  return withErrorHandling(async () => {
    const updateData = {
      name: updates.name,
      description: updates.description,
      budget: updates.budget,
      start_date: updates.startDate,
      end_date: updates.endDate,
      categories: updates.categories,
      status: updates.status
    };

    const { error } = await supabase
      .from("campaigns")
      .update(updateData)
      .eq("id", campaignId);

    if (error) throw error;
  }, "Failed to update campaign");
}

export async function updateCampaignStatus(campaignId: string, status: string) {
  return withErrorHandling(async () => {
    const { error } = await supabase
      .from("campaigns")
      .update({ status })
      .eq("id", campaignId);

    if (error) throw error;
  }, "Failed to update campaign status");
}

export async function deleteCampaign(campaignId: string) {
  return withErrorHandling(async () => {
    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", campaignId);

    if (error) throw error;
  }, "Failed to delete campaign");
}
