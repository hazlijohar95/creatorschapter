import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Send, 
  Loader, 
  ChevronLeft
} from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  conversation_id: string; // Add this to match what's used in component
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read_at: string | null;
}

interface Conversation {
  id: string;
  brand_id: string;
  created_at: string;
  brand_name: string;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
}

export default function CreatorMessaging() {
  const { user } = useAuthStore();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const queryClient = useQueryClient();
  const [mobileView, setMobileView] = useState<'list' | 'conversation'>('list');
  
  // Query for conversations
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['creator-conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        // Get all conversations for this creator
        const { data: convs, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('creator_id', user.id)
          .order('last_message_at', { ascending: false });
          
        if (error) throw error;
        if (!convs) return [];
        
        // Get brand names
        const brandIds = convs.map(conv => conv.brand_id);
        
        let brandNames: Record<string, string> = {};
        if (brandIds.length > 0) {
          const { data: brands, error: brandsError } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', brandIds);
            
          if (brandsError) throw brandsError;
          
          if (brands) {
            brandNames = brands.reduce((acc, brand) => ({
              ...acc,
              [brand.id]: brand.full_name || "Unknown Brand"
            }), {});
          }
        }
        
        // Get last messages and unread counts for each conversation
        const conversationsWithMeta = await Promise.all(
          convs.map(async (conv) => {
            // Get last message
            const { data: lastMsg } = await supabase
              .from('messages')
              .select('content, created_at')
              .eq('conversation_id', conv.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
              
            // Get unread count (messages TO creator that are unread)
            const { count } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conv.id)
              .eq('receiver_id', user.id)
              .is('read_at', null);
              
            return {
              ...conv,
              brand_name: brandNames[conv.brand_id] || "Unknown Brand",
              last_message: lastMsg?.content || "",
              last_message_at: lastMsg?.created_at || conv.created_at,
              unread_count: count || 0
            };
          })
        );
        
        return conversationsWithMeta as Conversation[];
      } catch (error) {
        console.error("Error fetching conversations:", error);
        throw error;
      }
    },
    enabled: !!user?.id
  });
  
  // Query for messages in active conversation
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['creator-messages', activeConversationId],
    queryFn: async () => {
      if (!activeConversationId) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', activeConversationId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      // Mark messages as read
      if (data && data.length > 0) {
        const unreadMessages = data
          .filter(msg => msg.receiver_id === user?.id && msg.read_at === null)
          .map(msg => msg.id);
          
        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .in('id', unreadMessages);
            
          // Refresh conversation list to update unread counts
          queryClient.invalidateQueries({ queryKey: ['creator-conversations'] });
        }
      }
      
      return data as Message[];
    },
    enabled: !!activeConversationId
  });
  
  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!user?.id) return;
    
    const channel = supabase
      .channel('creator-messages')
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('New message received:', payload);
          
          const newMessage = payload.new as Message;
          
          // Refresh active conversation if this message belongs to it
          if (activeConversationId && newMessage.conversation_id === activeConversationId) {
            queryClient.invalidateQueries({ queryKey: ['creator-messages', activeConversationId] });
            
            // Mark as read immediately if conversation is open
            supabase
              .from('messages')
              .update({ read_at: new Date().toISOString() })
              .eq('id', newMessage.id);
          }
          
          // Always refresh conversations list for unread count
          queryClient.invalidateQueries({ queryKey: ['creator-conversations'] });
          
          // Show notification if conversation isn't active
          if (!activeConversationId || newMessage.conversation_id !== activeConversationId) {
            // Get sender name
            supabase
              .from('profiles')
              .select('full_name')
              .eq('id', newMessage.sender_id)
              .single()
              .then(({ data: sender }) => {
                const senderName = sender?.full_name || "Someone";
                
                toast({
                  title: "New message",
                  description: `${senderName} sent you a message`,
                  type: "info",
                });
              });
          }
        })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, activeConversationId, queryClient]);
  
  const handleSendMessage = async () => {
    if (!user?.id || !activeConversationId || !newMessage.trim()) return;
    
    try {
      setIsSendingMessage(true);
      
      // Get brand_id for this conversation
      const { data: convo } = await supabase
        .from('conversations')
        .select('brand_id')
        .eq('id', activeConversationId)
        .single();
        
      if (!convo) throw new Error("Conversation not found");
      
      // Send the message
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: activeConversationId,
          sender_id: user.id,
          receiver_id: convo.brand_id,
          content: newMessage
        });
        
      if (error) throw error;
      
      // Clear input and refresh messages
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ['creator-messages', activeConversationId] });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again.",
        type: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };
  
  const selectConversation = (id: string) => {
    setActiveConversationId(id);
    setMobileView('conversation');
  };
  
  const formatMessageTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "h:mm a");
    } catch (e) {
      return "";
    }
  };
  
  const formatConversationTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      
      if (isToday) {
        return format(date, "h:mm a");
      } else {
        return format(date, "MMM d");
      }
    } catch (e) {
      return "";
    }
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-1">Sign in to access messages</h3>
          <p className="text-muted-foreground">You need to be signed in to view your messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversations list */}
        <div className={`md:col-span-1 ${mobileView === 'conversation' ? 'hidden md:block' : ''}`}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {conversationsLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : !conversations?.length ? (
                <div className="text-center py-12 px-4">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-medium mb-1">No messages yet</h3>
                  <p className="text-muted-foreground text-sm">
                    When you apply for opportunities or brands contact you, conversations will appear here.
                  </p>
                </div>
              ) : (
                <div>
                  {conversations.map(conversation => (
                    <div 
                      key={conversation.id}
                      className={`flex items-start p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${
                        activeConversationId === conversation.id ? 'bg-slate-100' : ''
                      }`}
                      onClick={() => selectConversation(conversation.id)}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-medium truncate">{conversation.brand_name}</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatConversationTime(conversation.last_message_at || conversation.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.last_message || "No messages yet"}</p>
                      </div>
                      {conversation.unread_count > 0 && (
                        <div className="ml-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread_count}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Message thread */}
        <div className={`md:col-span-2 ${mobileView === 'list' ? 'hidden md:block' : ''}`}>
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center">
                {mobileView === 'conversation' && (
                  <Button variant="ghost" size="icon" onClick={() => setMobileView('list')} className="md:hidden mr-2">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                )}
                <CardTitle className="text-lg">
                  {activeConversationId 
                    ? conversations?.find(c => c.id === activeConversationId)?.brand_name || "Message Thread" 
                    : "Select a conversation"
                  }
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col h-[500px]">
              {!activeConversationId ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="font-medium mb-1">No conversation selected</h3>
                    <p className="text-muted-foreground">Select a conversation from the list to view messages</p>
                  </div>
                </div>
              ) : messagesLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto mb-4">
                    {messages?.length ? (
                      <div className="space-y-4">
                        {messages.map(message => {
                          const isOwn = message.sender_id === user?.id;
                          
                          return (
                            <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] ${isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted text-slate-800'} rounded-lg px-4 py-2`}>
                                <div className="break-words">{message.content}</div>
                                <div className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                  {formatMessageTime(message.created_at)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-muted-foreground">No messages yet</p>
                          <p className="text-sm text-muted-foreground">Send a message to start the conversation</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-end gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={isSendingMessage || !newMessage.trim()}
                      size="icon"
                    >
                      {isSendingMessage ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
