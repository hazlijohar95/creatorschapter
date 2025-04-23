import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, Check, Clock, X, MessageSquare, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCreatorApplications } from "@/services/applicationService";
import { useAuthStore } from "@/lib/auth";

interface ApplicationProfile {
  id: string;
  full_name: string;
  username: string;
}

interface Application {
  id: string;
  status: string;
  application_message: string;
  brand_response: string | null;
  created_at: string;
  campaigns: {
    id: string;
    name: string;
    description: string;
    budget: number | null;
    end_date: string | null;
  };
  profiles: ApplicationProfile;
}

// Type guard to check if the response is valid and not an error
function isValidApplication(application: any): application is Application {
  return (
    application &&
    typeof application === 'object' &&
    'id' in application &&
    'profiles' in application &&
    application.profiles &&
    typeof application.profiles === 'object' &&
    'id' in application.profiles
  );
}

export default function ApplicationStatus() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: applicationsResponse = [], isLoading } = useQuery({
    queryKey: ["creator-applications", user?.id, activeTab],
    queryFn: () => getCreatorApplications(user!.id, activeTab !== "all" ? activeTab : undefined),
    enabled: !!user
  });
  
  // Filter out any invalid application data
  const applications = applicationsResponse.filter(isValidApplication);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "approved":
        return <Check className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-6 pb-12">
      <h1 className="text-2xl font-bold">My Applications</h1>
      
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
          ["all", "pending", "approved", "rejected"].map(tabValue => (
            <TabsContent key={tabValue} value={tabValue} className="mt-4">
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-lg font-medium">No applications found</p>
                    <p className="text-muted-foreground mt-2">
                      {tabValue === "all"
                        ? "You haven't applied to any campaigns yet."
                        : `You don't have any ${tabValue} applications.`}
                    </p>
                  </div>
                ) : (
                  applications.map((application) => (
                    <ApplicationCard key={application.id} application={application} />
                  ))
                )}
              </div>
            </TabsContent>
          ))
        )}
      </Tabs>
    </div>
  );
}

interface ApplicationCardProps {
  application: Application;
}

function ApplicationCard({ application }: ApplicationCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Not Selected</Badge>;
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
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{application.campaigns.name}</CardTitle>
            <CardDescription>
              Applied on {formattedDate}
            </CardDescription>
          </div>
          {getStatusBadge(application.status)}
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">Campaign by {application.profiles.full_name}</p>
            {application.campaigns.budget && (
              <p className="text-sm text-muted-foreground">
                Budget: ${application.campaigns.budget}
              </p>
            )}
          </div>
          
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm font-medium mb-1">Your application:</p>
            <p className="text-sm">{application.application_message}</p>
          </div>
          
          {application.brand_response && (
            <div className="bg-muted-foreground/10 p-3 rounded-md">
              <p className="text-sm font-medium mb-1">Response from brand:</p>
              <p className="text-sm">{application.brand_response}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-gray-50 pt-3 flex justify-between">
        {application.status === "approved" ? (
          <>
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact Brand
            </Button>
            <Button size="sm">View Campaign Details</Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm">
              View Campaign
            </Button>
            <Button 
              variant={application.status === "rejected" ? "outline" : "default"} 
              size="sm"
              disabled={application.status === "rejected"}
            >
              {application.status === "rejected" ? "Not Selected" : "Pending"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
