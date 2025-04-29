import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, X, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export interface Collaboration {
  id: string;
  title: string;
  brand_name: string;
  brand_id: string; // Add brand_id to the interface
  budget: number;
  deadline: string;
  description?: string;
  status: "active" | "pending" | "completed" | "declined";
  created_at: string;
  updated_at?: string;
  campaign_id: string;
}

interface CollaborationCardProps {
  collaboration: Collaboration;
  onStatusChange: () => void;
}

export function CollaborationCard({ collaboration, onStatusChange }: CollaborationCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "declined":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleStatusUpdate = async (newStatus: "active" | "pending" | "completed" | "declined") => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from("campaign_creators")
        .update({ status: newStatus })
        .eq("id", collaboration.id);
        
      if (error) throw error;
      
      toast({
        title: "Status updated",
        description: `Collaboration status changed to ${newStatus}`,
        type: "success",
      });
      
      // Refresh collaborations data
      queryClient.invalidateQueries({ queryKey: ["creator-collaborations"] });
      onStatusChange();
    } catch (error) {
      console.error("Error updating collaboration status:", error);
      toast({
        title: "Error updating status",
        description: "There was a problem updating the collaboration status",
        type: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMessageBrand = async () => {
    try {
      if (!user) return;
      
      // Check if conversation already exists
      const { data: existingConversation, error: convError } = await supabase
        .from("conversations")
        .select("id")
        .eq("creator_id", user.id)
        .eq("brand_id", collaboration.brand_id)
        .maybeSingle();
        
      if (convError) throw convError;
      
      let conversationId;
      
      // Create conversation if it doesn't exist
      if (!existingConversation) {
        // Create the conversation directly with the brand_id from collaboration
        const { data: newConversation, error: createError } = await supabase
          .from("conversations")
          .insert({
            creator_id: user.id,
            brand_id: collaboration.brand_id
          })
          .select()
          .single();
          
        if (createError) throw createError;
        conversationId = newConversation.id;
      } else {
        conversationId = existingConversation.id;
      }
      
      // Navigate to messaging with this conversation selected
      navigate("/creator-dashboard/messaging"); // You'll need to implement the conversation selection
      
      // For now, just notify the user
      toast({
        title: "Messaging ready",
        description: "You can now message the brand about this collaboration",
      });
    } catch (error) {
      console.error("Error setting up conversation:", error);
      toast({
        title: "Error",
        description: "Could not set up messaging with this brand",
        type: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold">{collaboration.title}</h3>
            <p className="text-sm text-muted-foreground">{collaboration.brand_name}</p>
          </div>
          <Badge variant="outline" className={`${getStatusColor(collaboration.status)} capitalize`}>
            {collaboration.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-y-2">
            <div className="flex items-center text-sm w-full sm:w-1/2">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">Created:</span>
              {formatDate(collaboration.created_at)}
            </div>
            <div className="flex items-center text-sm w-full sm:w-1/2">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">Deadline:</span>
              {formatDate(collaboration.deadline)}
            </div>
          </div>
          {collaboration.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {collaboration.description}
            </p>
          )}
          <div className="text-sm">
            <span className="font-medium">Budget:</span> ${collaboration.budget}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 bg-muted/20 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={handleMessageBrand}
        >
          <MessageSquare className="h-3.5 w-3.5 mr-1" />
          Message Brand
        </Button>

        {collaboration.status === "pending" && (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleStatusUpdate("active")}
              disabled={isUpdating}
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusUpdate("declined")}
              disabled={isUpdating}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Decline
            </Button>
          </>
        )}
        
        {collaboration.status === "active" && (
          <Button
            variant="default"
            size="sm"
            onClick={() => handleStatusUpdate("completed")}
            disabled={isUpdating}
          >
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Mark Complete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
