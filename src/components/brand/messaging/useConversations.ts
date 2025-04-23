
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";

export interface Conversation {
  id: string;
  creatorName: string;
  creatorHandle: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export function useConversations() {
  const { user } = useAuthStore();

  const { data: conversations = [], isLoading, error, refetch } = useQuery({
    queryKey: ["brand-conversations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];

      // Get all conversations where brand_id is current user
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          id,
          created_at,
          updated_at,
          last_message_at,
          creator_id,
          brand_id
        `)
        .eq("brand_id", user.id);

      if (error) throw error;
      if (!data) return [];

      // Fetch creators profiles for conversation list display
      const creatorIds = data.map((conv) => conv.creator_id);
      let creatorsMap: Record<string, { full_name: string; username: string; }> = {};
      if (creatorIds.length > 0) {
        const { data: creators } = await supabase
          .from("profiles")
          .select("id, full_name, username")
          .in("id", creatorIds);

        if (creators) {
          creators.forEach((c) => {
            creatorsMap[c.id] = {
              full_name: c.full_name ?? "Unknown",
              username: c.username ?? "",
            };
          });
        }
      }

      // Get last message preview for each conversation (could be optimized further)
      const augmentedConversations = await Promise.all(
        data.map(async (conv: any) => {
          let lastMsg = "";
          let lastMsgTime = conv.last_message_at;
          let unread = false;

          // Fetch latest message
          const { data: messages } = await supabase
            .from("messages")
            .select("content, sender_id, created_at, read_at")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1);

          if (messages && messages.length > 0) {
            lastMsg = messages[0].content;
            lastMsgTime = messages[0].created_at;
            // If message is not read and not sent by this brand, mark as unread
            unread = !messages[0].read_at && messages[0].sender_id !== user.id;
          }

          return {
            id: conv.id,
            creatorName: creatorsMap[conv.creator_id]?.full_name ?? "Unknown",
            creatorHandle:
              creatorsMap[conv.creator_id]?.username
                ? "@" + creatorsMap[conv.creator_id].username
                : "",
            avatar: "",
            lastMessage: lastMsg,
            timestamp: lastMsgTime
              ? new Date(lastMsgTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "",
            unread,
          };
        })
      );
      return augmentedConversations;
    },
  });

  return { conversations, isLoading, error, refetch };
}
