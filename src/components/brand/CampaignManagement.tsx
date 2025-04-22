
import { useState } from "react";
import { Briefcase, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

// Mock data
const CAMPAIGNS = [
  {
    id: 1,
    name: "Summer Collection Launch",
    status: "active",
    start: "June 1, 2025",
    end: "July 15, 2025",
    budget: "$5,000",
    progress: 65,
    creators: [
      { id: 1, name: "Alex Johnson", avatar: "" },
      { id: 2, name: "Jamie Smith", avatar: "" }
    ]
  },
  {
    id: 2,
    name: "Fall Product Line",
    status: "planning",
    start: "Aug 15, 2025",
    end: "Oct 30, 2025",
    budget: "$7,500",
    progress: 25,
    creators: [
      { id: 3, name: "Taylor Wilson", avatar: "" }
    ]
  },
  {
    id: 3,
    name: "Holiday Special",
    status: "draft",
    start: "Nov 1, 2025",
    end: "Dec 31, 2025",
    budget: "$10,000",
    progress: 10,
    creators: []
  }
];

export function CampaignManagement() {
  const [activeTab, setActiveTab] = useState("all");
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "planning":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Campaign Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4">
            {CAMPAIGNS.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="mt-4">
          <div className="grid gap-4">
            {CAMPAIGNS.filter(c => c.status === 'active').map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="planning" className="mt-4">
          <div className="grid gap-4">
            {CAMPAIGNS.filter(c => c.status === 'planning').map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="draft" className="mt-4">
          <div className="grid gap-4">
            {CAMPAIGNS.filter(c => c.status === 'draft').map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <div className="grid gap-4">
            {CAMPAIGNS.filter(c => c.status === 'completed').map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface CampaignCardProps {
  campaign: {
    id: number;
    name: string;
    status: string;
    start: string;
    end: string;
    budget: string;
    progress: number;
    creators: {
      id: number;
      name: string;
      avatar: string;
    }[];
  };
}

function CampaignCard({ campaign }: CampaignCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "planning":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{campaign.name}</CardTitle>
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Timeline:</span>
              <span>{campaign.start} - {campaign.end}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Budget:</span>
              <span>{campaign.budget}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span>{campaign.progress}%</span>
              </div>
              <Progress value={campaign.progress} />
            </div>
          </div>
          <div>
            <div className="text-sm mb-2">
              <span className="text-muted-foreground">Creators:</span>
              {campaign.creators.length === 0 && (
                <p className="italic text-muted-foreground mt-1">No creators assigned yet</p>
              )}
            </div>
            <div className="flex -space-x-2">
              {campaign.creators.map((creator) => (
                <Avatar key={creator.id} className="border-2 border-white">
                  <AvatarImage src={creator.avatar} />
                  <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              ))}
              <Button size="sm" variant="outline" className="rounded-full h-8 w-8 p-0 ml-2">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm">Details</Button>
          <Button size="sm">Manage</Button>
        </div>
      </CardContent>
    </Card>
  );
}
