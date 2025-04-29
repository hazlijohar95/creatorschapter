
import { useState } from "react";
import { useAuthStore } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Opportunity, Application } from "@/components/dashboard/types/opportunity";

export function useOpportunityActions() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Apply to an opportunity
  const handleApply = async (opportunityId: string, message: string) => {
    try {
      if (!user) {
        toast({ 
          title: "Authentication required", 
          description: "Please log in to apply for opportunities",
          type: "destructive"
        });
        return Promise.reject("Not authenticated");
      }

      setIsLoading(true);
      
      // Check if already applied
      const { data: existingApplications } = await supabase
        .from("campaign_creators")
        .select("id")
        .eq("campaign_id", opportunityId)
        .eq("creator_id", user.id)
        .single();
        
      if (existingApplications) {
        toast({
          title: "Already applied",
          description: "You have already applied to this opportunity",
          type: "warning"
        });
        setIsLoading(false);
        return Promise.reject("Already applied");
      }
      
      // Submit new application
      const { data, error } = await supabase
        .from("campaign_creators")
        .insert({
          campaign_id: opportunityId,
          creator_id: user.id,
          status: "pending",
          application_message: message
        })
        .select();
        
      if (error) {
        throw error;
      }
      
      // Refresh applications
      queryClient.invalidateQueries({ queryKey: ['applications', user.id] });
      
      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted",
        type: "success"
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error applying to opportunity:", error);
      toast({
        title: "Failed to submit application",
        description: "There was an error submitting your application. Please try again.",
        type: "destructive"
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  // View opportunity details
  const handleViewOpportunity = (opportunityId: string, opportunities: Opportunity[]) => {
    const opportunity = opportunities.find((o) => o.id === opportunityId);
    if (opportunity) {
      setSelectedOpportunity(opportunity);
      setIsDetailModalOpen(true);
    }
  };

  // View application details
  const handleViewApplication = (applicationId: string, applications: Application[], opportunities: Opportunity[]) => {
    const application = applications.find((a) => a.id === applicationId);
    if (application) {
      setSelectedApplication(application);
      setIsApplicationDialogOpen(true);
      
      const opportunityId = application.opportunity.id;
      const fullOpportunity = opportunities.find((o) => o.id === opportunityId);
      if (fullOpportunity) {
        setSelectedOpportunity(fullOpportunity);
      }
    }
  };

  // Setup messaging with brand
  const handleMessageBrand = async (applicationId: string, applications: Application[]) => {
    const application = applications.find((a) => a.id === applicationId);
    if (!application || !user) return;

    try {
      // Get the brand ID from the application
      const { data: campaignData, error: campaignError } = await supabase
        .from("campaigns")
        .select("brand_id")
        .eq("id", application.opportunity.id)
        .single();
        
      if (campaignError) throw campaignError;
      
      const brandId = campaignData.brand_id;
      
      // Check if conversation already exists
      const { data: existingConversation, error: convError } = await supabase
        .from("conversations")
        .select("id")
        .eq("creator_id", user.id)
        .eq("brand_id", brandId)
        .maybeSingle();
        
      if (convError) throw convError;
      
      let conversationId;
      
      // Create conversation if it doesn't exist
      if (!existingConversation) {
        const { data: newConversation, error: createError } = await supabase
          .from("conversations")
          .insert({
            creator_id: user.id,
            brand_id: brandId
          })
          .select()
          .single();
          
        if (createError) throw createError;
        conversationId = newConversation.id;
      } else {
        conversationId = existingConversation.id;
      }
      
      toast({
        title: "Conversation ready",
        description: "You can now message the brand about this opportunity",
        type: "success"
      });
      
      console.log("Opening conversation:", conversationId);
    } catch (error) {
      console.error("Error setting up conversation:", error);
      toast({
        title: "Couldn't set up messaging",
        description: "There was an error setting up the conversation with this brand",
        type: "destructive"
      });
    }
  };

  return {
    selectedOpportunity,
    selectedApplication,
    isDetailModalOpen,
    isApplicationDialogOpen,
    isActionLoading: isLoading,
    handleApply,
    handleViewOpportunity,
    handleViewApplication,
    handleMessageBrand,
    setIsDetailModalOpen,
    setIsApplicationDialogOpen
  };
}
