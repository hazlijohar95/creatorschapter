
import { supabase } from "@/integrations/supabase/client";
import { Application, Status, ApplicationApiResponse } from "@/types/applications";
import { withErrorHandling } from "./serviceUtils";
import { transformApplicationData } from "@/utils/applicationTransformers";

// Get applications for a brand
export async function getBrandApplications(brandId: string) {
  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from("campaign_creators")
      .select(`
        id,
        status,
        application_message,
        brand_response,
        created_at,
        campaigns!inner(
          id,
          name,
          description,
          budget
        ),
        profiles!creator_id(
          id,
          full_name,
          username,
          avatar_url
        )
      `)
      .eq("campaigns.brand_id", brandId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform data to match Application interface
    return (data || []).map((item: any) => transformApplicationData(item));
  }, "Failed to fetch applications");
}

// Update application status
export async function updateApplicationStatus(applicationId: string, status: Status) {
  return withErrorHandling(async () => {
    const { error } = await supabase
      .from("campaign_creators")
      .update({ status })
      .eq("id", applicationId);
    
    if (error) throw error;
  }, "Failed to update application status");
}

// Add note to application
export async function addApplicationNote(applicationId: string, note: string) {
  return withErrorHandling(async () => {
    const { error } = await supabase
      .from("campaign_creators")
      .update({ brand_response: note })
      .eq("id", applicationId); // Fixed: using applicationId instead of id
    
    if (error) throw error;
  }, "Failed to add application note");
}
