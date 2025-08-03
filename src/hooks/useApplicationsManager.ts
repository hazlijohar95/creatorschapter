
import { useState } from 'react';
import { useApplicationsQuery, UseApplicationsQueryOptions } from './queries/useApplicationsQuery';
import { useApplicationStore } from '@/store/applicationStore';
import { Application, Status } from '@/types/applications';
import { useToast } from './use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/services/queryKeys';
import { logger } from '@/lib/logger';

interface AddNoteParams {
  id: string;
  note: string;
}

interface UseApplicationsManagerOptions {
  queryOptions?: UseApplicationsQueryOptions;
  initialApplications?: Application[];
}

export function useApplicationsManager(options: UseApplicationsManagerOptions = {}) {
  const { queryOptions, initialApplications } = options;
  const [currentPage, setCurrentPage] = useState(0);
  
  const { data = [], isLoading: isLoadingData, refetch } = useApplicationsQuery({
    ...queryOptions,
    page: currentPage
  });
  
  const applications = initialApplications || data;
  const { selectedApplications, toggleApplicationSelection, clearSelection } = useApplicationStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: Status }) => {
      logger.debug(`Updating application status`, { applicationId: id, status });
      const { error } = await supabase
        .from('campaign_creators')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      return { id, status };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.brandApplications] });
      
      const statusMessages = {
        approved: "Application approved successfully",
        rejected: "Application rejected",
        in_discussion: "Application moved to discussion"
      };
      
      toast({
        title: statusMessages[data.status] || "Status updated",
        type: data.status === "approved" ? "success" : "default"
      });
      
      // If moving to discussion, create a conversation if one doesn't exist
      if (data.status === "in_discussion") {
        createConversationIfNeeded(data.id);
      }
    },
    onError: (error) => {
      logger.error("Error updating application status", error);
      toast({
        title: "Error updating application",
        description: "There was a problem updating the application status. Please try again.",
        type: "destructive"
      });
    }
  });
  
  const addNoteMutation = useMutation({
    mutationFn: async ({ id, note }: AddNoteParams) => {
      logger.debug(`Adding note to application`, { applicationId: id, noteLength: note.length });
      const { error } = await supabase
        .from('campaign_creators')
        .update({ brand_response: note })
        .eq('id', id);
        
      if (error) throw error;
      return { id, note };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.brandApplications] });
      toast({
        title: "Note added",
        description: "Your note has been added to the application",
        type: "success"
      });
    },
    onError: (error) => {
      logger.error("Error adding note", error);
      toast({
        title: "Error adding note",
        description: "There was a problem adding your note. Please try again.",
        type: "destructive"
      });
    }
  });

  const createConversationIfNeeded = async (applicationId: string) => {
    try {
      // First get the application data to get creator_id
      const { data: applicationData, error: appError } = await supabase
        .from("campaign_creators")
        .select(`
          creator_id,
          campaigns!inner(brand_id)
        `)
        .eq("id", applicationId)
        .single();
        
      if (appError) throw appError;
      
      const creatorId = applicationData.creator_id;
      const brandId = applicationData.campaigns.brand_id;
      
      if (!creatorId || !brandId) {
        throw new Error("Missing creator or brand ID");
      }
      
      // Check if a conversation already exists
      const { data: existingConversation, error: convError } = await supabase
        .from("conversations")
        .select("id")
        .eq("creator_id", creatorId)
        .eq("brand_id", brandId)
        .maybeSingle();
        
      if (convError) throw convError;
      
      // If no conversation exists, create one
      if (!existingConversation) {
        const { data: newConversation, error: createError } = await supabase
          .from("conversations")
          .insert([{
            creator_id: creatorId,
            brand_id: brandId
          }])
          .select()
          .single();
          
        if (createError) throw createError;
        
        logger.info("Created new conversation", { conversationId: newConversation.id, applicationId });
      } else {
        logger.debug("Conversation already exists", { conversationId: existingConversation.id, applicationId });
      }
    } catch (error) {
      logger.error("Error creating conversation", error, { applicationId });
    }
  };

  const handleApprove = async (id: string) => {
    await updateStatusMutation.mutate({ id, status: "approved" });
  };

  const handleReject = async (id: string) => {
    await updateStatusMutation.mutate({ id, status: "rejected" });
  };

  const handleDiscuss = async (id: string) => {
    await updateStatusMutation.mutate({ id, status: "in_discussion" });
  };

  const handleBulkAction = async (action: "approve" | "reject" | "discuss") => {
    if (selectedApplications.length === 0) {
      toast({
        title: "No applications selected",
        description: "Please select at least one application to perform this action.",
        type: "destructive"
      });
      return;
    }

    const newStatus = action === "approve" ? "approved" : 
                     action === "reject" ? "rejected" : "in_discussion";

    let successCount = 0;
    let errorCount = 0;

    for (const id of selectedApplications) {
      try {
        await updateStatusMutation.mutateAsync({ id, status: newStatus as Status });
        successCount++;
      } catch {
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast({
        title: `${successCount} applications updated`,
        description: `Status changed to ${newStatus}.`,
        type: "success"
      });
    }

    if (errorCount > 0) {
      toast({
        title: `${errorCount} updates failed`,
        description: "Some applications couldn't be updated. Please try again.",
        type: "destructive"
      });
    }

    clearSelection();
  };

  const addNote = async ({ id, note }: AddNoteParams) => {
    await addNoteMutation.mutate({ id, note });
  };

  const loadMoreApplications = () => {
    setCurrentPage(prev => prev + 1);
  };

  const loadPreviousApplications = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    applications,
    selectedApplications,
    handleApprove,
    handleReject,
    handleDiscuss,
    handleBulkAction,
    addNote,
    toggleApplicationSelection,
    clearSelection,
    isUpdating: updateStatusMutation.isPending,
    isAddingNote: addNoteMutation.isPending,
    isLoadingData,
    currentPage,
    loadMoreApplications,
    loadPreviousApplications,
    refetch
  };
}
