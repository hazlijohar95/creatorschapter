
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
      
      // Get active campaigns count
      const { data: activeCampaigns, error: campaignsError } = await supabase
        .from("campaigns")
        .select("id", { count: "exact" })
        .eq("brand_id", userId)
        .eq("status", "active");

      if (campaignsError) throw campaignsError;

      // Get applications count
      const { data: applications, error: applicationsError } = await supabase
        .from("campaign_creators")
        .select("id", { count: "exact" })
        .eq("status", "pending");

      if (applicationsError) throw applicationsError;

      // Get active collaborations count (approved campaign creators)
      const { data: collaborations, error: collaborationsError } = await supabase
        .from("campaign_creators")
        .select("id", { count: "exact" })
        .eq("status", "approved");

      if (collaborationsError) throw collaborationsError;

      // Get content delivered count from campaign metrics
      const { data: metrics, error: metricsError } = await supabase
        .from("campaign_metrics")
        .select("campaign_id", { count: "exact", distinct: true });

      if (metricsError) throw metricsError;

      return {
        activeCampaigns: activeCampaigns?.length || 0,
        creatorApplications: applications?.length || 0,
        activeCollaborations: collaborations?.length || 0,
        contentDelivered: metrics?.length || 0
      };
    },
    enabled: !!userId
  });

  // Fetch recent applications
  const { data: recentApplications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["brandRecentApplications", userId],
    queryFn: async (): Promise<RecentApplication[]> => {
      if (!userId) throw new Error("No user ID");
      
      const { data, error } = await supabase
        .from("campaign_creators")
        .select(`
          id,
          created_at,
          campaigns!inner(
            name,
            brand_id
          ),
          profiles!creator_id(
            full_name
          )
        `)
        .eq("campaigns.brand_id", userId)
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
    },
    enabled: !!userId
  });

  // Fetch upcoming deadlines
  const { data: upcomingDeadlines, isLoading: deadlinesLoading } = useQuery({
    queryKey: ["brandUpcomingDeadlines", userId],
    queryFn: async (): Promise<Deadline[]> => {
      if (!userId) throw new Error("No user ID");
      
      const { data, error } = await supabase
        .from("campaigns")
        .select("id, name, end_date")
        .eq("brand_id", userId)
        .order("end_date", { ascending: true })
        .limit(3);

      if (error) throw error;

      return (data || [])
        .filter(item => item.end_date) // Only include items with end_date
        .map(item => ({
          id: item.id,
          name: item.name,
          date: item.end_date,
          type: "Campaign End"
        }));
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
