
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface Conversation {
  id: string;
  creatorName: string;
  creatorHandle: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  campaign?: string;
  creatorId: string;
}

export function useConversations() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      try {
        // Get all conversations for the current brand
        const { data: conversationsData, error: conversationsError } = await supabase
          .from("conversations")
          .select(`
            id, 
            creator_id,
            brand_id,
            last_message_at
          `)
          .eq("brand_id", user.id)
          .is("brand_archived_at", null)
          .order("last_message_at", { ascending: false });

        if (conversationsError) throw conversationsError;
        if (!conversationsData || conversationsData.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }

        // Get creator profiles
        const creatorIds = conversationsData.map(c => c.creator_id);
        const { data: creatorsData, error: creatorsError } = await supabase
          .from("profiles")
          .select(`
            id, 
            full_name, 
            username, 
            avatar_url
          `)
          .in("id", creatorIds);

        if (creatorsError) throw creatorsError;

        // Create a map of creator profiles for easy lookup
        const creatorMap = new Map();
        creatorsData?.forEach(creator => {
          creatorMap.set(creator.id, creator);
        });

        // Get campaign connections for creators
        const { data: campaignCreatorsData, error: campaignError } = await supabase
          .from("campaign_creators")
          .select(`
            creator_id,
            campaigns(
              id,
              name
            )
          `)
          .in("creator_id", creatorIds)
          .eq("status", "approved");

        if (campaignError) throw campaignError;
        
        const creatorCampaignMap = new Map();
        campaignCreatorsData?.forEach(connection => {
          if (connection.campaigns) {
            creatorCampaignMap.set(connection.creator_id, connection.campaigns.name);
          }
        });

        // Get latest message and unread count for each conversation
        const conversationPromises = conversationsData.map(async conversation => {
          // Get latest message
          const { data: latestMessageData, error: messageError } = await supabase
            .from("messages")
            .select("content, created_at, read_at, receiver_id")
            .eq("conversation_id", conversation.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (messageError && messageError.code !== "PGRST116") {
            console.error("Error fetching latest message:", messageError);
          }

          // Get unread count
          const { count: unreadCount, error: unreadError } = await supabase
            .from("messages")
            .select("id", { count: "exact" })
            .eq("conversation_id", conversation.id)
            .eq("receiver_id", user.id)
            .is("read_at", null);

          if (unreadError) {
            console.error("Error fetching unread count:", unreadError);
          }

          const creator = creatorMap.get(conversation.creator_id);
          
          return {
            id: conversation.id,
            creatorId: conversation.creator_id,
            creatorName: creator?.full_name || "Unknown Creator",
            creatorHandle: creator?.username || "",
            avatar: creator?.avatar_url || "",
            lastMessage: latestMessageData?.content || "No messages yet",
            timestamp: latestMessageData?.created_at || conversation.last_message_at || new Date().toISOString(),
            unread: unreadCount ? unreadCount > 0 : false,
            campaign: creatorCampaignMap.get(conversation.creator_id),
          };
        });

        const conversationResults = await Promise.all(conversationPromises);
        setConversations(conversationResults);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to message changes to update conversation list
    const channel = supabase
      .channel("conversation_updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          // Refresh conversations when a new message comes in
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { conversations, loading, error };
}
