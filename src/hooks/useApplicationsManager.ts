
import { useApplicationsQuery } from './queries/useApplicationsQuery';
import { useApplicationStore } from '@/store/applicationStore';
import { Application } from '@/types/applications';
import { useToast } from './use-toast';

export function useApplicationsManager(initialApplications: Application[]) {
  const { applications, updateStatus, addNote, isUpdating, isAddingNote } = useApplicationsQuery(initialApplications);
  const { selectedApplications, toggleApplicationSelection, clearSelection } = useApplicationStore();
  const { toast } = useToast();

  const handleApprove = async (id: string) => {
    await updateStatus({ id, status: "approved" });
  };

  const handleReject = async (id: string) => {
    await updateStatus({ id, status: "rejected" });
  };

  const handleDiscuss = async (id: string) => {
    await updateStatus({ id, status: "in_discussion" });
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
        await updateStatus({ id, status: newStatus });
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
    isUpdating,
    isAddingNote
  };
}
