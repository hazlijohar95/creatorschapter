
import { useState } from "react";
import { Application, Status } from "../types/applications";
import { useToast } from "./use-toast";

export function useApplications(initialApplications: Application[]) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const { toast } = useToast();

  const handleApprove = (id: string) => {
    setApplications(apps => apps.map(app =>
      app.id === id ? { ...app, status: "approved", isNew: false } : app
    ));
    toast({
      title: "Application approved",
      description: "The creator has been notified of your decision.",
    });
  };

  const handleReject = (id: string) => {
    setApplications(apps => apps.map(app =>
      app.id === id ? { ...app, status: "rejected", isNew: false } : app
    ));
    toast({
      title: "Application rejected",
      description: "The creator has been notified of your decision.",
    });
  };

  const handleDiscuss = (id: string) => {
    setApplications(apps => apps.map(app =>
      app.id === id ? { ...app, status: "in_discussion", isNew: false } : app
    ));
    toast({
      title: "Application moved to discussion",
      description: "You can now message the creator directly.",
    });
  };

  const handleBulkAction = (action: "approve" | "reject" | "discuss") => {
    if (selectedApplications.length === 0) {
      toast({
        title: "No applications selected",
        description: "Please select at least one application to perform this action.",
        variant: "destructive"
      });
      return;
    }

    let updatedApplications = [...applications];
    const newStatus: Status = action === "approve" ? "approved" : action === "reject" ? "rejected" : "in_discussion";
    
    selectedApplications.forEach(id => {
      updatedApplications = updatedApplications.map(app =>
        app.id === id ? { ...app, status: newStatus, isNew: false } : app
      );
    });

    setApplications(updatedApplications);
    setSelectedApplications([]);
    
    toast({
      title: `${selectedApplications.length} applications updated`,
      description: `Status changed to ${newStatus}.`
    });
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
    toggleApplicationSelection,
    clearSelection: () => setSelectedApplications([])
  };
}
