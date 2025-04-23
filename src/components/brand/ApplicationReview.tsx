
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationCard } from "./ApplicationCard";

// Explicit Status type and Application interface for strong typing
type Status = "pending" | "approved" | "rejected";

interface Application {
  id: number;
  creatorName: string;
  creatorHandle: string;
  avatar: string;
  campaign: string;
  date: string;
  status: Status;
  message: string;
  categories: string[];
  match: number;
  isNew: boolean;
  budget: string;
}

// Mock data with explicit typing for status
const APPLICATIONS: Application[] = [
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
  // Fixed: Use string as the base type to be compatible with Tabs component
  const [activeTab, setActiveTab] = useState<string>("all");
  const [applications, setApplications] = useState<Application[]>(APPLICATIONS);

  // Update application status with correct type
  const handleApprove = (id: number) => {
    setApplications(apps => apps.map(app =>
      app.id === id ? { ...app, status: "approved", isNew: false } : app
    ));
  };
  const handleReject = (id: number) => {
    setApplications(apps => apps.map(app =>
      app.id === id ? { ...app, status: "rejected", isNew: false } : app
    ));
  };

  // Fixed: Update tabFiltered function to work with string
  const tabFiltered = (tab: string) =>
    tab === "all" ? applications : applications.filter(a => a.status === tab as Status);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold font-space">Creator Applications</h1>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        {["all", "pending", "approved", "rejected"].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tabFiltered(tab).length > 0 ? (
                tabFiltered(tab).map(application => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center py-16 animate-fade-in">
                  <span className="text-5xl mb-2">🕵️‍♂️</span>
                  <h2 className="text-lg font-semibold mb-1">No applications found</h2>
                  <p className="text-muted-foreground mb-2">Try another tab or check back later.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
