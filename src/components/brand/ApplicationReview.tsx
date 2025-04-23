
import { useState } from "react";
import { Check, X, MessageSquare, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBrandApplications, updateApplicationStatus } from "@/services/campaignService";

interface Application {
  id: string;
  status: string;
  application_message: string;
  created_at: string;
  campaigns: {
    id: string;
    name: string;
    brand_id: string;
  };
  profiles: {
    id: string;
    full_name: string;
    username: string;
    avatar_url?: string;
  };
}

export function ApplicationReview() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("all");
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseAction, setResponseAction] = useState<"approve" | "reject" | null>(null);
  
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["brand-applications", user?.id, activeTab],
    queryFn: () => getBrandApplications(user!.id, activeTab !== "all" ? activeTab : undefined),
    enabled: !!user
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: ({applicationId, status, message}: {applicationId: string, status: string, message?: string}) => {
      return updateApplicationStatus(applicationId, status, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brand-applications"] });
      setResponseDialogOpen(false);
      setResponseMessage("");
      setSelectedApplication(null);
      
      toast({
        title: `Application ${responseAction === "approve" ? "approved" : "rejected"}`,
        description: "The creator has been notified of your decision.",
      });
    },
    onError: (error) => {
      console.error("Error updating application status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleResponse = (application: Application, action: "approve" | "reject") => {
    setSelectedApplication(application);
    setResponseAction(action);
    setResponseDialogOpen(true);
  };
  
  const submitResponse = () => {
    if (!selectedApplication || !responseAction) return;
    
    updateStatusMutation.mutate({
      applicationId: selectedApplication.id,
      status: responseAction,
      message: responseMessage
    });
  };
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Creator Applications</h1>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading applications...</span>
          </div>
        ) : (
          <>
            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">No applications found</p>
                  </div>
                ) : (
                  applications.map((application) => (
                    <ApplicationCard 
                      key={application.id} 
                      application={application} 
                      onApprove={() => handleResponse(application, "approve")}
                      onReject={() => handleResponse(application, "reject")}
                    />
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-4">
              <div className="space-y-4">
                {applications.filter(a => a.status === 'pending').length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">No pending applications</p>
                  </div>
                ) : (
                  applications.filter(a => a.status === 'pending').map((application) => (
                    <ApplicationCard 
                      key={application.id} 
                      application={application} 
                      onApprove={() => handleResponse(application, "approve")}
                      onReject={() => handleResponse(application, "reject")}
                    />
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="approved" className="mt-4">
              <div className="space-y-4">
                {applications.filter(a => a.status === 'approved').length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">No approved applications</p>
                  </div>
                ) : (
                  applications.filter(a => a.status === 'approved').map((application) => (
                    <ApplicationCard 
                      key={application.id} 
                      application={application} 
                      onApprove={() => handleResponse(application, "approve")}
                      onReject={() => handleResponse(application, "reject")}
                    />
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="rejected" className="mt-4">
              <div className="space-y-4">
                {applications.filter(a => a.status === 'rejected').length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">No rejected applications</p>
                  </div>
                ) : (
                  applications.filter(a => a.status === 'rejected').map((application) => (
                    <ApplicationCard 
                      key={application.id} 
                      application={application} 
                      onApprove={() => handleResponse(application, "approve")}
                      onReject={() => handleResponse(application, "reject")}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
      
      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {responseAction === "approve" ? "Approve Application" : "Reject Application"}
            </DialogTitle>
            <DialogDescription>
              {responseAction === "approve" 
                ? "Add a message for the creator about next steps or expectations." 
                : "Provide feedback on why this application wasn't the right fit."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedApplication.profiles.avatar_url} />
                    <AvatarFallback>{selectedApplication.profiles.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedApplication.profiles.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Applied for <span className="font-medium">{selectedApplication.campaigns.name}</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded-md text-sm">
                  <p className="font-medium mb-1">Application message:</p>
                  <p>{selectedApplication.application_message}</p>
                </div>
                
                <Textarea
                  placeholder={responseAction === "approve" 
                    ? "Add any details about next steps..." 
                    : "Provide feedback on why the application wasn't selected..."
                  }
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setResponseDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={submitResponse}
                  disabled={updateStatusMutation.isPending}
                  variant={responseAction === "approve" ? "default" : "destructive"}
                >
                  {updateStatusMutation.isPending ? (
                    <><span className="animate-spin">●</span> Processing...</>
                  ) : (
                    responseAction === "approve" ? "Approve" : "Reject"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ApplicationCardProps {
  application: Application;
  onApprove: () => void;
  onReject: () => void;
}

function ApplicationCard({ application, onApprove, onReject }: ApplicationCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const formattedDate = new Date(application.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={application.profiles.avatar_url} />
            <AvatarFallback>{application.profiles.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h3 className="font-semibold">{application.profiles.full_name}</h3>
                  <span className="text-sm text-muted-foreground">@{application.profiles.username}</span>
                </div>
                <p className="text-sm">
                  Applied for <span className="font-medium">{application.campaigns.name}</span> on {formattedDate}
                </p>
              </div>
              <div className="mt-2 md:mt-0">
                {getStatusBadge(application.status)}
              </div>
            </div>
            
            <div className="mt-2 text-sm">
              <p className="text-muted-foreground">{application.application_message}</p>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {application.status === "pending" && (
                <>
                  <Button size="sm" variant="outline" className="text-green-600" onClick={onApprove}>
                    <Check className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600" onClick={onReject}>
                    <X className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
              <Button size="sm" variant="outline">
                <MessageSquare className="mr-1 h-4 w-4" />
                Message
              </Button>
              <Button size="sm">View Profile</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
