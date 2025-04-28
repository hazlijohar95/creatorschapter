
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export interface BrandDashboardStats {
  activeCampaigns: number;
  creatorApplications: number;
  activeCollaborations: number;
  contentDelivered: number;
}

export interface RecentApplication {
  id: string;
  creator_name: string;
  campaign_name: string;
  created_at: string;
}

export interface Deadline {
  id: string;
  name: string;
  date: string;
  type: string;
}

export function useBrandDashboardStats() {
  const { user } = useAuthStore();
  const userId = user?.id;

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
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
        console.log("All campaign IDs:", campaignIds);
        
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
          console.log("Applications count:", applicationsCount);
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
          console.log("Active collaborations count:", collaborationsCount);
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
          console.log("Content delivered count:", contentCount);
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

  // Fetch recent applications
  const { data: recentApplications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["brandRecentApplications", userId],
    queryFn: async (): Promise<RecentApplication[]> => {
      if (!userId) throw new Error("No user ID");
      
      try {
        // First, get all campaign IDs for this brand
        const { data: campaigns, error: campaignsError } = await supabase
          .from("campaigns")
          .select("id")
          .eq("brand_id", userId);
          
        if (campaignsError) throw campaignsError;
        
        const campaignIds = campaigns?.map(c => c.id) || [];
        if (campaignIds.length === 0) return [];
        
        // Then get recent applications for these campaigns
        const { data, error } = await supabase
          .from("campaign_creators")
          .select(`
            id,
            created_at,
            campaign_id,
            campaigns!inner(name),
            creator_id,
            profiles!creator_id(full_name)
          `)
          .in("campaign_id", campaignIds)
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) throw error;

        return (data || []).map(item => ({
          id: item.id,
          creator_name: item.profiles?.full_name || "Unknown Creator",
          campaign_name: item.campaigns?.name || "Unknown Campaign",
          created_at: item.created_at
        }));
      } catch (error) {
        console.error("Error fetching recent applications:", error);
        return [];
      }
    },
    enabled: !!userId
  });

  // Fetch upcoming deadlines
  const { data: upcomingDeadlines, isLoading: deadlinesLoading } = useQuery({
    queryKey: ["brandUpcomingDeadlines", userId],
    queryFn: async (): Promise<Deadline[]> => {
      if (!userId) throw new Error("No user ID");
      
      try {
        const { data, error } = await supabase
          .from("campaigns")
          .select("id, name, end_date")
          .eq("brand_id", userId)
          .not('end_date', 'is', null)
          .order("end_date", { ascending: true })
          .limit(3);

        if (error) throw error;

        return (data || [])
          .filter(item => item.end_date) // Double-check we have dates
          .map(item => ({
            id: item.id,
            name: item.name,
            date: item.end_date,
            type: "Campaign End"
          }));
      } catch (error) {
        console.error("Error fetching upcoming deadlines:", error);
        return [];
      }
    },
    enabled: !!userId
  });

  return {
    stats,
    recentApplications,
    upcomingDeadlines,
    isLoading: statsLoading || applicationsLoading || deadlinesLoading
  };
}
