
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
    match: Number(0), // Explicitly convert to number
    isNew: false,
    budget: item.campaigns.budget ? Number(item.campaigns.budget).toString() : "Not specified",
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

// Add note to application - Using the messages table instead of application_notes
export async function addApplicationNote(applicationId: string, note: string) {
  // Since there's no application_notes table, we'll use the messages table
  // and create a special conversation for application notes
  
  // First, get the application details to find the creator and brand
  const { data: applicationData, error: applicationError } = await supabase
    .from("campaign_creators")
    .select(`
      creator_id,
      campaigns(brand_id)
    `)
    .eq("id", applicationId)
    .single();
  
  if (applicationError) throw applicationError;
  
  // Create or find a conversation for this application
  const conversationName = `application-notes-${applicationId}`;
  const { data: existingConversation, error: convQueryError } = await supabase
    .from("conversations")
    .select("id")
    .eq("creator_id", applicationData.creator_id)
    .eq("brand_id", applicationData.campaigns.brand_id)
    .single();
  
  if (convQueryError && convQueryError.code !== "PGRST116") throw convQueryError;
  
  let conversationId;
  
  if (!existingConversation) {
    // Create a new conversation for this application
    const { data: newConversation, error: createConvError } = await supabase
      .from("conversations")
      .insert({
        creator_id: applicationData.creator_id,
        brand_id: applicationData.campaigns.brand_id
      })
      .select()
      .single();
    
    if (createConvError) throw createConvError;
    conversationId = newConversation.id;
  } else {
    conversationId = existingConversation.id;
  }
  
  // Add the note as a message
  const { error: messageError } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: applicationData.campaigns.brand_id,
      receiver_id: applicationData.creator_id,
      content: `[Application Note] ${note}`
    });
  
  if (messageError) throw messageError;
}
