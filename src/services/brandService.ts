
import { supabase } from "@/integrations/supabase/client";
import { withErrorHandling } from "./serviceUtils";
import { getBrandProfile as getProfile, updateBrandProfile as updateProfile } from "./profileService";
import { getSocialLinks, saveSocialLink, deleteSocialLink } from "./profileService";

// Re-export from profileService for backwards compatibility
export const getBrandProfile = getProfile;
export const updateBrandProfile = updateProfile;

// Re-export social links functions
export { getSocialLinks, saveSocialLink, deleteSocialLink };

// Get brand analytics overview
export async function getBrandAnalyticsOverview(brandId: string) {
  return withErrorHandling(async () => {
    // Get campaigns count
    const { data: campaigns, error: campaignsError } = await supabase
      .from("campaigns")
      .select("id", { count: "exact" })
      .eq("brand_id", brandId);
    
    if (campaignsError) throw campaignsError;

    // Get active campaigns count
    const { data: activeCampaigns, error: activeError } = await supabase
      .from("campaigns")
      .select("id", { count: "exact" })
      .eq("brand_id", brandId)
      .eq("status", "active");
    
    if (activeError) throw activeError;

    // Get total campaign applications
    const { data: applications, error: appError } = await supabase
      .from("campaign_creators")
      .select("campaigns!inner(brand_id)", { count: "exact" })
      .eq("campaigns.brand_id", brandId);
    
    if (appError) throw appError;

    // Get metrics summary
    const { data: metrics, error: metricsError } = await supabase
      .from("campaign_metrics")
      .select(`
        impressions,
        engagement_rate,
        campaign_id,
        campaigns!inner(brand_id)
      `)
      .eq("campaigns.brand_id", brandId);
    
    if (metricsError) throw metricsError;

    // Calculate total impressions and average engagement rate
    let totalImpressions = 0;
    let totalEngagementRates = 0;
    let totalCampaignsWithMetrics = 0;

    metrics?.forEach(metric => {
      if (metric.impressions) totalImpressions += metric.impressions;
      if (metric.engagement_rate) {
        totalEngagementRates += Number(metric.engagement_rate);
        totalCampaignsWithMetrics++;
      }
    });

    const avgEngagementRate = totalCampaignsWithMetrics > 0 
      ? totalEngagementRates / totalCampaignsWithMetrics 
      : 0;

    return {
      totalCampaigns: campaigns?.length ?? 0,
      activeCampaigns: activeCampaigns?.length ?? 0,
      totalApplications: applications?.length ?? 0,
      totalImpressions,
      avgEngagementRate
    };
  }, "Failed to fetch brand analytics overview");
}
