
import { useApplicationsQuery } from './queries/useApplicationsQuery';
import { useApplicationStore } from '@/store/applicationStore';
import { Application } from '@/types/applications';
import { useToast } from './use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useApplicationsManager(initialApplications?: Application[]) {
  const { data: applications = [] } = useApplicationsQuery();
  const { selectedApplications, toggleApplicationSelection, clearSelection } = useApplicationStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase
        .from('campaign_creators')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brandApplications'] });
    }
  });
  
  const addNoteMutation = useMutation({
    mutationFn: async ({ id, note }: { id: string, note: string }) => {
      const { error } = await supabase
        .from('campaign_creators')
        .update({ brand_response: note })
        .eq('id', id);
        
      if (error) throw error;
      return { id, note };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brandApplications'] });
    }
  });

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
        variant: "destructive"
      });
      return;
    }

    const newStatus = action === "approve" ? "approved" : 
                     action === "reject" ? "rejected" : "in_discussion";

    let successCount = 0;
    let errorCount = 0;

    for (const id of selectedApplications) {
      try {
        await updateStatusMutation.mutateAsync({ id, status: newStatus });
        successCount++;
      } catch {
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast({
        title: `${successCount} applications updated`,
        description: `Status changed to ${newStatus}.`
      });
    }

    if (errorCount > 0) {
      toast({
        title: `${errorCount} updates failed`,
        description: "Some applications couldn't be updated. Please try again.",
        variant: "destructive"
      });
    }

    clearSelection();
  };

  const addNote = async (id: string, note: string) => {
    await addNoteMutation.mutate({ id, note });
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
    isAddingNote: addNoteMutation.isPending
  };
}
