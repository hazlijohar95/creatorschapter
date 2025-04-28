
import { supabase } from "@/integrations/supabase/client";
import { withErrorHandling } from "../serviceUtils";
import type { CampaignMetrics } from "@/types/campaign";

export async function getCampaignMetrics(campaignId: string) {
  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from("campaign_metrics")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("date", { ascending: false });

    if (error) throw error;
    return data as CampaignMetrics[];
  }, "Failed to fetch campaign metrics");
}

export async function addCampaignMetrics(data: {
  campaignId: string;
  date?: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  engagementRate?: number;
  roi?: number;
}) {
  return withErrorHandling(async () => {
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
  }, "Failed to add campaign metrics");
}
