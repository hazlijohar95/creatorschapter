
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/services/queryKeys";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Application, Status } from "@/types/applications";
import { transformApplicationData } from "@/utils/applicationTransformers";
import { logger } from "@/lib/logger";

export interface UseApplicationsQueryOptions {
  brandId?: string;
  limit?: number;
  page?: number;
  status?: Status;
}

export function useApplicationsQuery(options: UseApplicationsQueryOptions = {}) {
  const { user } = useAuthStore();
  const { brandId, limit = 100, page = 0, status } = options;
  const brand_id = brandId || user?.id;
  const offset = page * limit;

  return useQuery({
    queryKey: [queryKeys.brandApplications, brand_id, limit, page, status],
    queryFn: async () => {
      if (!brand_id) {
        throw new Error("Brand ID is required to fetch applications.");
      }

      logger.debug(`Fetching applications for brand`, { brandId: brand_id, status: status || 'all', page, limit });
      
      try {
        // First get the campaign IDs for this brand
        const { data: campaignData, error: campaignError } = await supabase
          .from("campaigns")
          .select("id")
          .eq("brand_id", brand_id);
          
        if (campaignError) {
          logger.error("Error fetching brand campaigns", campaignError, { brandId: brand_id });
          throw new Error(`Failed to fetch brand campaigns: ${campaignError.message}`);
        }
        
        if (!campaignData || campaignData.length === 0) {
          logger.debug("No campaigns found for this brand", { brandId: brand_id });
          return [];
        }
        
        const campaignIds = campaignData.map(c => c.id);
        logger.debug(`Found campaigns for brand`, { brandId: brand_id, campaignCount: campaignIds.length });
        
        // Now get applications for these campaigns
        let query = supabase
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
              budget,
              categories
            ),
            profiles (
              id,
              full_name, 
              username, 
              avatar_url
            )
          `
          )
          .in("campaign_id", campaignIds)
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);
          
        // Add status filter if specified
        if (status) {
          query = query.eq("status", status);
        }
          
        const { data, error } = await query;

        if (error) {
          logger.error("Error fetching applications", error, { brandId: brand_id });
          throw new Error(`Failed to fetch applications: ${error.message}`);
        }

        logger.debug(`Retrieved applications`, { brandId: brand_id, applicationCount: data?.length || 0 });
        
        // Transform data to match the Application interface
        return (data || []).map((item) => transformApplicationData(item));
      } catch (error) {
        logger.error("Error in useApplicationsQuery", error, { brandId: brand_id });
        throw error;
      }
    },
    enabled: !!brand_id,
  });
}
