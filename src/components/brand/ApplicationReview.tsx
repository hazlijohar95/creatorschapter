
import { useState } from "react";
import { Check, X, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock data
const APPLICATIONS = [
  {
    id: 1,
    creatorName: "Alex Johnson",
    creatorHandle: "@alexcreates",
    avatar: "",
    campaign: "Summer Collection Launch",
    date: "May 25, 2025",
    status: "pending",
    message: "I love your brand and would be excited to collaborate on the summer collection. My audience loves fashion content."
  },
  {
    id: 2,
    creatorName: "Jamie Smith",
    creatorHandle: "@jamiesmith",
    avatar: "",
    campaign: "Fall Product Line",
    date: "May 23, 2025",
    status: "approved",
    message: "I've been a fan of your products for years and would love to showcase them to my followers."
  },
  {
    id: 3,
    creatorName: "Taylor Wilson",
    creatorHandle: "@taylorwilson",
    avatar: "",
    campaign: "Summer Collection Launch",
    date: "May 20, 2025",
    status: "rejected",
    message: "Your summer collection would be a perfect fit for my content calendar. I have some great ideas to showcase these pieces."
  }
];

export function ApplicationReview() {
  const [activeTab, setActiveTab] = useState("all");
  
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
        
        <TabsContent value="all" className="mt-4">
          <div className="space-y-4">
            {APPLICATIONS.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          <div className="space-y-4">
            {APPLICATIONS.filter(a => a.status === 'pending').map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="approved" className="mt-4">
          <div className="space-y-4">
            {APPLICATIONS.filter(a => a.status === 'approved').map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-4">
          <div className="space-y-4">
            {APPLICATIONS.filter(a => a.status === 'rejected').map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ApplicationCardProps {
  application: {
    id: number;
    creatorName: string;
    creatorHandle: string;
    avatar: string;
    campaign: string;
    date: string;
    status: string;
    message: string;
  };
}

function ApplicationCard({ application }: ApplicationCardProps) {
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
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={application.avatar} />
            <AvatarFallback>{application.creatorName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h3 className="font-semibold">{application.creatorName}</h3>
                  <span className="text-sm text-muted-foreground">{application.creatorHandle}</span>
                </div>
                <p className="text-sm">
                  Applied for <span className="font-medium">{application.campaign}</span> on {application.date}
                </p>
              </div>
              <div className="mt-2 md:mt-0">
                {getStatusBadge(application.status)}
              </div>
            </div>
            
            <div className="mt-2 text-sm">
              <p className="text-muted-foreground">{application.message}</p>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {application.status === "pending" && (
                <>
                  <Button size="sm" variant="outline" className="text-green-600">
                    <Check className="mr-1 h-4 w-4" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
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
