
import { supabase } from "@/integrations/supabase/client";
import { Application, Status } from "@/types/applications";

// Get applications for a brand
export async function getBrandApplications(brandId: string) {
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
  return (data || []).map((item): Application => ({
    id: item.id,
    creatorName: item.profiles.full_name || "Anonymous",
    creatorHandle: item.profiles.username || "",
    avatar: item.profiles.avatar_url || "",
    campaign: item.campaigns.name,
    date: new Date(item.created_at).toLocaleDateString(),
    status: item.status as Status,
    message: item.application_message || "",
    categories: [],
    match: 0, // To be implemented with AI matching
    isNew: false,
    budget: item.campaigns.budget?.toString() || "Not specified",
    audienceSize: "",
    engagement: "",
    notes: []
  }));
}

// Update application status
export async function updateApplicationStatus(applicationId: string, status: Status) {
  const { error } = await supabase
    .from("campaign_creators")
    .update({ status })
    .eq("id", applicationId);
  
  if (error) throw error;
}

// Add note to application
export async function addApplicationNote(applicationId: string, note: string) {
  const { error } = await supabase
    .from("application_notes")
    .insert([{
      application_id: applicationId,
      content: note
    }]);
  
  if (error) throw error;
}

