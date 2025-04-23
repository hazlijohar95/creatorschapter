
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
import { getBrandApplications, updateApplicationStatus } from "@/services/applicationService";

interface Application {
  id: string;
  status: string;
  application_message: string | null;
  brand_response: string | null;
  created_at: string;
  campaigns: {
    id: string;
    name: string;
  };
  profiles: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export function ApplicationReview() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [responseType, setResponseType] = useState<"approve" | "reject" | null>(null);
  
  // Fetch applications for this brand
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["brand-applications", user?.id, activeTab],
    queryFn: () => getBrandApplications(user!.id, activeTab !== "all" ? activeTab : undefined),
    enabled: !!user
  });
  
  // Update application status mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, status, response }: { id: string, status: string, response?: string }) => 
      updateApplicationStatus(id, status, response),
    onSuccess: () => {
      toast({
        title: "Application updated",
        description: responseType === "approve" ? "The creator has been approved." : "The creator has not been selected for this campaign.",
      });
      queryClient.invalidateQueries({ queryKey: ["brand-applications"] });
      setDialogOpen(false);
      setResponseMessage("");
      setSelectedApp(null);
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: "There was an error updating the application. Please try again.",
        variant: "destructive",
      });
      console.error("Application update error:", error);
    }
  });
  
  const handleResponseClick = (app: Application, type: "approve" | "reject") => {
    setSelectedApp(app);
    setResponseType(type);
    setDialogOpen(true);
  };
  
  const submitResponse = () => {
    if (!selectedApp) return;
    
    updateMutation.mutate({
      id: selectedApp.id,
      status: responseType === "approve" ? "approved" : "rejected",
      response: responseMessage.trim() || undefined
    });
  };
  
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
        
        <TabsContent value={activeTab} className="mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading applications...</span>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center p-12">
              <p className="text-lg font-medium">No applications found</p>
              <p className="text-muted-foreground mt-2">
                You don't have any {activeTab !== "all" ? activeTab : ""} applications to review.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{app.campaigns.name}</CardTitle>
                      {getStatusBadge(app.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={app.profiles.avatar_url || undefined} />
                        <AvatarFallback>
                          {app.profiles.full_name?.substring(0, 2) || app.profiles.username?.substring(0, 2) || "CR"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <p className="font-medium">{app.profiles.full_name || app.profiles.username || "Creator"}</p>
                        <p className="text-sm text-muted-foreground">
                          Applied {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                        
                        <div className="mt-3 bg-muted p-3 rounded-md">
                          <p className="text-sm">{app.application_message}</p>
                        </div>
                        
                        {app.brand_response && (
                          <div className="mt-3 bg-muted-foreground/10 p-3 rounded-md">
                            <p className="text-sm font-medium mb-1">Your response:</p>
                            <p className="text-sm">{app.brand_response}</p>
                          </div>
                        )}
                        
                        {app.status === "pending" && (
                          <div className="mt-4 flex gap-2 justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleResponseClick(app, "reject")}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleResponseClick(app, "approve")}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        )}
                        
                        {app.status === "approved" && (
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="mr-1 h-4 w-4" />
                              Message Creator
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {responseType === "approve" ? "Approve Application" : "Reject Application"}
            </DialogTitle>
            <DialogDescription>
              {responseType === "approve" 
                ? "Approve this creator for your campaign. You can include additional information below."
                : "Let the creator know why they weren't selected for this campaign."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium">Creator: {selectedApp?.profiles.full_name || selectedApp?.profiles.username}</p>
              <p className="text-sm text-muted-foreground">Campaign: {selectedApp?.campaigns.name}</p>
            </div>
            
            <Textarea 
              placeholder={responseType === "approve" 
                ? "Add any additional details or next steps..."
                : "Provide feedback on why they weren't selected..."
              }
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              rows={5}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={updateMutation.isPending}>
              Cancel
            </Button>
            <Button 
              onClick={submitResponse} 
              disabled={updateMutation.isPending}
              variant={responseType === "approve" ? "default" : "destructive"}
            >
              {updateMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              ) : responseType === "approve" ? (
                <>Approve Creator</>
              ) : (
                <>Reject Application</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
