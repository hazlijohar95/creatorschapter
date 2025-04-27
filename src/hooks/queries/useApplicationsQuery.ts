
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Application, Status } from '@/types/applications';
import { queryKeys } from '@/services/queryKeys';
import { useToast } from '@/hooks/use-toast';
import { updateApplicationStatus, addApplicationNote } from '@/services/applicationService';

export function useApplicationsQuery(initialApplications: Application[]) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: applications = initialApplications } = useQuery({
    queryKey: queryKeys.applications(),
    queryFn: async () => initialApplications, // In the future, this would fetch from API
    initialData: initialApplications
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      return await updateApplicationStatus(id, status);
    },
    onSuccess: (_, { id, status }) => {
      queryClient.setQueryData<Application[]>(
        queryKeys.applications(),
        (old = []) => old.map(app =>
          app.id === id ? { ...app, status, isNew: false } : app
        )
      );
      
      toast({
        title: "Status updated",
        description: `Application status has been updated to ${status}.`
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const noteMutation = useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }) => {
      return await addApplicationNote(id, note);
    },
    onSuccess: (_, { id, note }) => {
      queryClient.setQueryData<Application[]>(
        queryKeys.applications(),
        (old = []) => old.map(app =>
          app.id === id ? { ...app, notes: [...(app.notes || []), note] } : app
        )
      );
      
      toast({
        title: "Note added",
        description: "Your note has been saved to this application."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add note",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    applications,
    updateStatus: statusMutation.mutate,
    addNote: noteMutation.mutate,
    isUpdating: statusMutation.isPending,
    isAddingNote: noteMutation.isPending
  };
}
