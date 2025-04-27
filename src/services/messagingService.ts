
import { supabase } from "@/integrations/supabase/client";

// Create a new conversation
export async function createConversation(creatorId: string, brandId: string) {
  const { data, error } = await supabase
    .from("conversations")
    .insert([{
      creator_id: creatorId,
      brand_id: brandId,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Send a message
export async function sendMessage(conversationId: string, senderId: string, receiverId: string, content: string) {
  const { error } = await supabase
    .from("messages")
    .insert([{
      conversation_id: conversationId,
      sender_id: senderId,
      receiver_id: receiverId,
      content
    }]);

  if (error) throw error;
}

// Mark messages as read
export async function markMessagesAsRead(conversationId: string, userId: string) {
  const { error } = await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("receiver_id", userId)
    .is("read_at", null);

  if (error) throw error;
}

// Get messages for a conversation
export async function getConversationMessages(conversationId: string) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select(`
        id,
        content,
        sender_id,
        created_at,
        read_at,
        profiles:sender_id(
          full_name,
          avatar_url
        )
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    
    // Process the data to ensure it matches the expected format
    return data.map(message => ({
      ...message,
      profiles: {
        full_name: message.profiles?.full_name || 'Unknown User',
        avatar_url: message.profiles?.avatar_url || ''
      }
    }));
  } catch (error) {
    console.error("Error in getConversationMessages:", error);
    throw error;
  }
}

// Archive conversation
export async function archiveConversation(conversationId: string, userId: string, userRole: 'brand' | 'creator') {
  const updateField = userRole === 'brand' ? 'brand_archived_at' : 'creator_archived_at';
  
  const { error } = await supabase
    .from("conversations")
    .update({ [updateField]: new Date().toISOString() })
    .eq("id", conversationId);

  if (error) throw error;
}
