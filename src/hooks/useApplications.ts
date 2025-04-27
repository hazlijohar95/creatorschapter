
import { useState } from "react";
import { Application, Status } from "../types/applications";
import { useToast } from "./use-toast";
import { updateApplicationStatus, addApplicationNote } from "@/services/applicationService";
import { useDataOperation } from "./useDataOperation";

export function useApplications(initialApplications: Application[]) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Use our new data operation hook for status updates
  const { execute: executeStatusUpdate, loading: statusUpdateLoading } = 
    useDataOperation(updateApplicationStatus);
  
  // Use our new data operation hook for adding notes
  const { execute: executeAddNote, loading: addNoteLoading } = 
    useDataOperation(addApplicationNote);

  const handleApprove = async (id: string) => {
    // Update UI optimistically
    setApplications(apps => apps.map(app =>
      app.id === id ? { ...app, status: "approved", isNew: false } : app
    ));
    
    // Call API and handle any errors
    const result = await executeStatusUpdate(id, "approved");
    
    // If the API call returned null, it failed
    if (result === null) {
      // Revert UI update if API call failed
      setApplications(apps => apps.map(app =>
        app.id === id ? { ...app, status: applications.find(a => a.id === id)?.status || "pending" } : app
      ));
    } else {
      toast({
        title: "Application approved",
        description: "The creator has been notified of your decision.",
      });
    }
  };

  const handleReject = async (id: string) => {
    // Update UI optimistically
    setApplications(apps => apps.map(app =>
      app.id === id ? { ...app, status: "rejected", isNew: false } : app
    ));
    
    // Call API and handle any errors
    const result = await executeStatusUpdate(id, "rejected");
    
    // If the API call returned null, it failed
    if (result === null) {
      // Revert UI update if API call failed
      setApplications(apps => apps.map(app =>
        app.id === id ? { ...app, status: applications.find(a => a.id === id)?.status || "pending" } : app
      ));
    } else {
      toast({
        title: "Application rejected",
        description: "The creator has been notified of your decision.",
      });
    }
  };

  const handleDiscuss = async (id: string) => {
    // Update UI optimistically
    setApplications(apps => apps.map(app =>
      app.id === id ? { ...app, status: "in_discussion", isNew: false } : app
    ));
    
    // Call API and handle any errors
    const result = await executeStatusUpdate(id, "in_discussion");
    
    // If the API call returned null, it failed
    if (result === null) {
      // Revert UI update if API call failed
      setApplications(apps => apps.map(app =>
        app.id === id ? { ...app, status: applications.find(a => a.id === id)?.status || "pending" } : app
      ));
    } else {
      toast({
        title: "Application moved to discussion",
        description: "You can now message the creator directly.",
      });
    }
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

    const newStatus: Status = action === "approve" ? "approved" : action === "reject" ? "rejected" : "in_discussion";
    
    // Optimistic update
    let updatedApplications = [...applications];
    selectedApplications.forEach(id => {
      updatedApplications = updatedApplications.map(app =>
        app.id === id ? { ...app, status: newStatus, isNew: false } : app
      );
    });
    
    setApplications(updatedApplications);
    
    // Track successful and failed operations
    let successCount = 0;
    let errorCount = 0;
    
    // Execute each status update individually
    for (const id of selectedApplications) {
      const result = await executeStatusUpdate(id, newStatus);
      if (result !== null) {
        successCount++;
      } else {
        errorCount++;
      }
    }
    
    // Show summary toast
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
    
    setSelectedApplications([]);
  };

  const handleAddNote = async (id: string, note: string) => {
    if (!note.trim()) return;
    
    const result = await executeAddNote(id, note);
    
    if (result !== null) {
      // Update local state to reflect the new note
      setApplications(apps => apps.map(app => {
        if (app.id === id) {
          return {
            ...app,
            notes: [...(app.notes || []), note]
          };
        }
        return app;
      }));
      
      toast({
        title: "Note added",
        description: "Your note has been saved to this application."
      });
    }
  };

  const handleBulkMessage = () => {
    if (selectedApplications.length === 0) {
      toast({
        title: "No applications selected",
        description: "Please select at least one application to send a message.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message sent",
      description: `Message sent to ${selectedApplications.length} creators.`
    });
    setSelectedApplications([]);
  };

  const toggleApplicationSelection = (id: string) => {
    setSelectedApplications(prev => 
      prev.includes(id) 
        ? prev.filter(appId => appId !== id)
        : [...prev, id]
    );
  };

  return {
    applications,
    selectedApplications,
    handleApprove,
    handleReject,
    handleDiscuss,
    handleBulkAction,
    handleBulkMessage,
    handleAddNote,
    toggleApplicationSelection,
    clearSelection: () => setSelectedApplications([]),
    loading: statusUpdateLoading || addNoteLoading
  };
}
