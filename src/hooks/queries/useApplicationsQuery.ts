
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/services/queryKeys";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Application, Status } from "@/types/applications";
import { transformApplicationData } from "@/utils/applicationTransformers";

export interface UseApplicationsQueryOptions {
  brandId?: string;
  limit?: number;
  page?: number;
}

export function useApplicationsQuery(options: UseApplicationsQueryOptions = {}) {
  const { user } = useAuthStore();
  const { brandId, limit = 100, page = 0 } = options;
  const brand_id = brandId || user?.id;
  const offset = page * limit;

  return useQuery({
    queryKey: [queryKeys.brandApplications, brand_id, limit, page],
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
          application_message,
          brand_response,
          campaigns (
            id,
            name,
            description,
            budget
          ),
          profiles (
            full_name, 
            username, 
            avatar_url
          )
        `
        )
        .eq("campaigns.brand_id", brand_id)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error("Error fetching applications:", error);
        throw new Error(`Failed to fetch applications: ${error.message}`);
      }

      // Transform data to match the Application interface
      return (data || []).map((item: any) => transformApplicationData(item));
    },
    enabled: !!brand_id,
  });
}
