
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export interface RecentApplication {
  id: string;
  creator_name: string;
  campaign_name: string;
  created_at: string;
}

export function useRecentApplications() {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
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
}
