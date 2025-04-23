
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, CheckCircle, Clock, XCircle, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";

export interface Collaboration {
  id: string;
  title: string;
  brand_name: string;
  budget: number;
  deadline: string;
  description?: string;
  status: "active" | "pending" | "completed" | "declined";
  created_at: string;
  campaign_id: string;
}

interface CollaborationCardProps {
  collaboration: Collaboration;
  onStatusChange?: () => void;
}

export function CollaborationCard({ collaboration, onStatusChange }: CollaborationCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" /> 
            Active
          </span>
        );
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
            <Clock className="h-3 w-3 mr-1" /> 
            Pending
          </span>
        );
      case "completed":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" /> 
            Completed
          </span>
        );
      case "declined":
        return (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
            <XCircle className="h-3 w-3 mr-1" /> 
            Declined
          </span>
        );
      default:
        return null;
    }
  };

  const handleStatusChange = async (newStatus: "active" | "pending" | "completed" | "declined") => {
    try {
      const { error } = await supabase
        .from("campaign_creators")
        .update({ status: newStatus })
        .eq("id", collaboration.id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Collaboration status changed to ${newStatus}`,
      });

      if (onStatusChange) {
        onStatusChange();
      }
      
      setIsDetailsOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Update failed",
        description: "Could not update collaboration status",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between">
            <CardTitle className="text-lg">{collaboration.title}</CardTitle>
            {getStatusBadge(collaboration.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Brand:</span>
              <span className="text-sm font-medium">{collaboration.brand_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Budget:</span>
              <span className="text-sm font-medium">{formatCurrency(collaboration.budget)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Deadline:</span>
              <span className="text-sm font-medium">{formatDate(collaboration.deadline)}</span>
            </div>
            <div className="pt-2 flex justify-between gap-2">
              {collaboration.status === "active" && (
                <>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                  <Button size="sm" onClick={() => setIsMessageOpen(true)}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </>
              )}
              {collaboration.status === "pending" && (
                <>
                  <Button variant="outline" size="sm" onClick={() => handleStatusChange("declined")}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Decline
                  </Button>
                  <Button size="sm" onClick={() => handleStatusChange("active")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept
                  </Button>
                </>
              )}
              {(collaboration.status === "completed" || collaboration.status === "declined") && (
                <Button variant="outline" size="sm" onClick={() => setIsDetailsOpen(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              )}
              {!["completed", "declined"].includes(collaboration.status) && (
                <Button variant="outline" size="sm" onClick={() => setIsDetailsOpen(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Details
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{collaboration.title}</DialogTitle>
            <DialogDescription>
              Collaboration with {collaboration.brand_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Status</h4>
              <div>{getStatusBadge(collaboration.status)}</div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Details</h4>
              <div className="bg-slate-50 p-3 rounded-md text-sm">
                <p className="mb-2">{collaboration.description || "No additional details provided."}</p>
                <div className="space-y-1 text-xs text-slate-500">
                  <p>Budget: {formatCurrency(collaboration.budget)}</p>
                  <p>Deadline: {formatDate(collaboration.deadline)}</p>
                  <p>Created: {formatDate(collaboration.created_at)}</p>
                </div>
              </div>
            </div>
            
            {collaboration.status === "active" && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Actions</h4>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleStatusChange("completed")} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog (placeholder - to be implemented in the messaging feature) */}
      <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message {collaboration.brand_name}</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">Messaging will be implemented in a future update.</p>
            <Button variant="outline" onClick={() => setIsMessageOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
