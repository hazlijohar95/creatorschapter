
import { useState } from "react";
import { Check, X, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
    message: "I love your brand and would be excited to collaborate on the summer collection. My audience loves fashion content.",
    categories: ["Fashion", "Summer", "Instagram"],
    match: 95,
    isNew: true,
    budget: "$1500-2000"
  },
  {
    id: 2,
    creatorName: "Jamie Smith",
    creatorHandle: "@jamiesmith",
    avatar: "",
    campaign: "Fall Product Line",
    date: "May 23, 2025",
    status: "approved",
    message: "I've been a fan of your products for years and would love to showcase them to my followers.",
    categories: ["Fashion", "Review"],
    match: 88,
    isNew: false,
    budget: "$800-1200"
  },
  {
    id: 3,
    creatorName: "Taylor Wilson",
    creatorHandle: "@taylorwilson",
    avatar: "",
    campaign: "Summer Collection Launch",
    date: "May 20, 2025",
    status: "rejected",
    message: "Your summer collection would be a perfect fit for my content calendar. I have some great ideas to showcase these pieces.",
    categories: ["Lifestyle", "Instagram", "Stories"],
    match: 75,
    isNew: false,
    budget: "$700"
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

        {/* Show tabs with visually consistent cards */}
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {APPLICATIONS.map(application => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {APPLICATIONS.filter(a => a.status === 'pending').map(application => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {APPLICATIONS.filter(a => a.status === 'approved').map(application => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {APPLICATIONS.filter(a => a.status === 'rejected').map(application => (
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
    categories: string[];
    match: number;
    isNew: boolean;
    budget: string;
  };
}

function ApplicationCard({ application }: ApplicationCardProps) {
  // We align status badge styles with OpportunityDiscovery (e.g. colored backgrounds).
  const statusColors = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
    approved: { bg: "bg-green-100", text: "text-green-800" },
    rejected: { bg: "bg-red-100", text: "text-red-800" }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={application.avatar} />
              <AvatarFallback>{application.creatorName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg leading-tight">{application.creatorName}</CardTitle>
              <CardDescription className="pt-0">{application.creatorHandle}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {application.isNew && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-1">New</span>
            )}
            <span
              className={`${statusColors[application.status as keyof typeof statusColors]?.bg} ${statusColors[application.status as keyof typeof statusColors]?.text} text-xs px-2 py-1 rounded-full font-medium`}
            >
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {application.categories.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-1">
        <p className="text-sm text-gray-600 line-clamp-3">{application.message}</p>
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Match score</span>
            <span className="font-medium">{application.match}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${
                application.match >= 90 ? "bg-green-500" : 
                application.match >= 80 ? "bg-blue-500" : 
                application.match >= 70 ? "bg-yellow-500" : "bg-orange-500"
              }`}
              style={{ width: `${application.match}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-gray-50 pt-3 flex flex-row gap-2 justify-between">
        <div className="flex gap-2">
          {application.status === "pending" && (
            <>
              <Button size="sm" variant="outline" className="text-green-600 border-green-200">
                <Check className="mr-1 h-4 w-4" />
                Approve
              </Button>
              <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                <X className="mr-1 h-4 w-4" />
                Reject
              </Button>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <MessageSquare className="mr-1 h-4 w-4" />
            Message
          </Button>
          <Button size="sm">View Profile</Button>
        </div>
      </CardFooter>
      <div className="px-6 pb-3 text-xs text-muted-foreground flex justify-between">
        <div>
          <span className="font-medium">{application.campaign}</span>
        </div>
        <div>
          <span>{application.budget}</span> • <span>{application.date}</span>
        </div>
      </div>
    </Card>
  );
}
