
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  activeCampaigns: number;
  creatorApplications: number;
  activeCollaborations: number;
  contentDelivered: number;
}

interface RecentApplication {
  id: string;
  creator_name: string;
  campaign_name: string;
}

interface Deadline {
  id: string;
  name: string;
  date: string;
  type: string;
}

export function useBrandDashboard() {
  const { user } = useAuthStore();
  const userId = user?.id;

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["brandDashboardStats", userId],
    queryFn: async (): Promise<DashboardStats> => {
      if (!userId) throw new Error("No user ID");
      
      // Get active campaigns count
      const { data: activeCampaigns } = await supabase
        .from("campaigns")
        .select("id", { count: "exact" })
        .eq("brand_id", userId)
        .eq("status", "active");

      // Get applications count
      const { data: applications } = await supabase
        .from("campaign_creators")
        .select("id", { count: "exact" })
        .eq("status", "pending");

      // These would typically come from other tables, using placeholder counts for now
      const activeCollaborations = 7;
      const contentDelivered = 15;

      return {
        activeCampaigns: activeCampaigns?.length ?? 0,
        creatorApplications: applications?.length ?? 0,
        activeCollaborations,
        contentDelivered
      };
    },
    enabled: !!userId
  });

  // Fetch recent applications
  const { data: recentApplications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["recentApplications", userId],
    queryFn: async (): Promise<RecentApplication[]> => {
      if (!userId) throw new Error("No user ID");
      
      const { data } = await supabase
        .from("campaign_creators")
        .select(`
          id,
          campaigns(name),
          profiles!creator_id(full_name)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(3);

      return (data ?? []).map(item => ({
        id: item.id,
        creator_name: item.profiles?.full_name ?? "Unknown Creator",
        campaign_name: item.campaigns?.name ?? "Unknown Campaign"
      }));
    },
    enabled: !!userId
  });

  // Fetch upcoming deadlines
  const { data: upcomingDeadlines, isLoading: deadlinesLoading } = useQuery({
    queryKey: ["upcomingDeadlines", userId],
    queryFn: async (): Promise<Deadline[]> => {
      if (!userId) throw new Error("No user ID");
      
      const { data } = await supabase
        .from("campaigns")
        .select("id, name, end_date")
        .eq("brand_id", userId)
        .order("end_date", { ascending: true })
        .limit(3);

      return (data ?? []).map(item => ({
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
