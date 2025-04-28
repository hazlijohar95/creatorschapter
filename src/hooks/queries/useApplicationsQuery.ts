
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/services/queryKeys";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Application, Status } from "@/types/applications";

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
          application_message,
          brand_response,
          campaigns (
            id,
            name,
            description
          ),
          profiles (
            full_name, 
            username, 
            avatar_url
          )
        `
        )
        .eq("campaigns.brand_id", brand_id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        throw new Error(`Failed to fetch applications: ${error.message}`);
      }

      // Transform data to match the Application interface
      return (data || []).map((item): Application => ({
        id: item.id,
        creatorName: item.profiles?.full_name || "Anonymous",
        creatorHandle: item.profiles?.username || "@unknown",
        avatar: item.profiles?.avatar_url || "",
        campaign: item.campaigns?.name || "Unknown Campaign",
        date: new Date(item.created_at).toLocaleDateString(),
        status: item.status as Status,
        message: item.application_message || "",
        categories: [],  // Default empty array
        match: 85,  // Default match score
        isNew: false,  // Default isNew status
        budget: "Unspecified",
        notes: item.brand_response ? [item.brand_response] : []
      }));
    },
  });
}
