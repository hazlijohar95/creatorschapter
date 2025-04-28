import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/services/queryKeys";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

interface Application {
  id: string;
  created_at: string;
  campaign_id: string;
  creator_id: string;
  status: string;
  campaigns: { name: string };
  profiles: { full_name: string; username: string; avatar_url: string };
}

export function useApplicationsQuery(brandId?: string) {
  const { user } = useAuthStore();
  const brand_id = brandId || user?.id;

  return useQuery({
    queryKey: [queryKeys.brandApplications, brand_id],
    queryFn: async () => {
      if (!brand_id) {
        throw new Error("Brand ID is required to fetch applications.");
      }

      const { data, error } = await supabase
        .from("campaign_creators")
        .select(
          `
          id,
          created_at,
          campaign_id,
          creator_id,
          status,
          campaigns (name),
          profiles (full_name, username, avatar_url)
        `
        )
        .eq("campaigns.brand_id", brand_id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        throw new Error(`Failed to fetch applications: ${error.message}`);
      }

      return data as Application[];
    },
  });
}
