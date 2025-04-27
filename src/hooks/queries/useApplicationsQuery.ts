
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
    queryFn: async () => initialApplications,
    initialData: initialApplications,
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      return await updateApplicationStatus(id, status);
    },
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.applications() });

      // Snapshot the previous value
      const previousApplications = queryClient.getQueryData<Application[]>(queryKeys.applications());

      // Optimistically update the cache
      queryClient.setQueryData<Application[]>(
        queryKeys.applications(),
        old => old?.map(app => app.id === id ? { ...app, status } : app)
      );

      return { previousApplications };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousApplications) {
        queryClient.setQueryData(queryKeys.applications(), context.previousApplications);
      }
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive"
      });
    },
    onSettled: () => {
      // Invalidate and refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.applications() });
    }
  });

  const noteMutation = useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }) => {
      return await addApplicationNote(id, note);
    },
    onMutate: async ({ id, note }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.applications() });
      const previousApplications = queryClient.getQueryData<Application[]>(queryKeys.applications());

      queryClient.setQueryData<Application[]>(
        queryKeys.applications(),
        old => old?.map(app =>
          app.id === id ? { ...app, notes: [...(app.notes || []), note] } : app
        )
      );

      return { previousApplications };
    },
    onError: (err, variables, context) => {
      if (context?.previousApplications) {
        queryClient.setQueryData(queryKeys.applications(), context.previousApplications);
      }
      toast({
        title: "Failed to add note",
        description: err.message,
        variant: "destructive"
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications() });
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
