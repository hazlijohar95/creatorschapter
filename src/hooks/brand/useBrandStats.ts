
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export interface BrandDashboardStats {
  activeCampaigns: number;
  creatorApplications: number;
  activeCollaborations: number;
  contentDelivered: number;
}

export function useBrandStats() {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: ["brandDashboardStats", userId],
    queryFn: async (): Promise<BrandDashboardStats> => {
      if (!userId) throw new Error("No user ID");
      
      console.log("Fetching brand dashboard stats for user ID:", userId);
      
      try {
        // Get active campaigns count
        const { data: activeCampaigns, error: campaignsError } = await supabase
          .from("campaigns")
          .select("id", { count: "exact" })
          .eq("brand_id", userId)
          .eq("status", "active");

        if (campaignsError) throw campaignsError;
        console.log("Active campaigns found:", activeCampaigns?.length);

        // Get all campaign IDs for this brand (needed for filtering applications)
        const { data: allCampaigns, error: allCampaignsError } = await supabase
          .from("campaigns")
          .select("id")
          .eq("brand_id", userId);
          
        if (allCampaignsError) throw allCampaignsError;
        
        const campaignIds = allCampaigns?.map(c => c.id) || [];
        
        // Get applications count - filtering by campaigns owned by this brand
        let applicationsCount = 0;
        if (campaignIds.length > 0) {
          const { data: applications, error: applicationsError } = await supabase
            .from("campaign_creators")
            .select("id", { count: "exact" })
            .in("campaign_id", campaignIds)
            .eq("status", "pending");

          if (applicationsError) throw applicationsError;
          applicationsCount = applications?.length || 0;
        }

        // Get active collaborations count (approved campaign creators)
        let collaborationsCount = 0;
        if (campaignIds.length > 0) {
          const { data: collaborations, error: collaborationsError } = await supabase
            .from("campaign_creators")
            .select("id", { count: "exact" })
            .in("campaign_id", campaignIds)
            .eq("status", "approved");

          if (collaborationsError) throw collaborationsError;
          collaborationsCount = collaborations?.length || 0;
        }

        // Get content delivered count from campaign metrics
        let contentCount = 0;
        if (campaignIds.length > 0) {
          const { data: metrics, error: metricsError } = await supabase
            .from("campaign_metrics")
            .select("id", { count: "exact" })
            .in("campaign_id", campaignIds);

          if (metricsError) throw metricsError;
          contentCount = metrics?.length || 0;
        }

        return {
          activeCampaigns: activeCampaigns?.length || 0,
          creatorApplications: applicationsCount,
          activeCollaborations: collaborationsCount,
          contentDelivered: contentCount
        };
      } catch (error) {
        console.error("Error fetching brand dashboard stats:", error);
        throw error;
      }
    },
    enabled: !!userId
  });
}
