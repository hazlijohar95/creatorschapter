
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
    // First get all messages for the conversation
    const { data: messagesData, error: messagesError } = await supabase
      .from("messages")
      .select(`
        id,
        content,
        sender_id,
        created_at,
        read_at
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (messagesError) throw messagesError;
    
    if (!messagesData || messagesData.length === 0) {
      return [];
    }
    
    // Then get all the profiles for the message senders in a separate query
    // to avoid the foreign key relation error
    const senderIds = [...new Set(messagesData.map(message => message.sender_id))];
    
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", senderIds);
      
    if (profilesError) throw profilesError;
    
    // Create a lookup map for profiles
    const profilesMap = (profilesData || []).reduce((acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {} as Record<string, { id: string, full_name: string, avatar_url: string }>);
    
    // Combine the messages with their sender profiles
    return messagesData.map(message => ({
      ...message,
      profiles: profilesMap[message.sender_id] 
        ? {
            full_name: profilesMap[message.sender_id].full_name || 'Unknown User',
            avatar_url: profilesMap[message.sender_id].avatar_url || ''
          }
        : {
            full_name: 'Unknown User',
            avatar_url: ''
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
