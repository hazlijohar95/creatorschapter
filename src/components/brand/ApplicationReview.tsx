import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationCard } from "./ApplicationCard";
import { Button } from "@/components/ui/button";
import { Filter, Check, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApplicationFilterBar } from "./applications/ApplicationFilterBar";
import { ApplicationDetailPanel } from "./applications/ApplicationDetailPanel";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type Status = "pending" | "approved" | "rejected" | "in_discussion";

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
  audienceSize?: string;
  engagement?: string;
  notes?: string[];
}

const APPLICATIONS: Application[] = [
  {
    id: 1,
    creatorName: "Alex Johnson",
    creatorHandle: "@alexcreates",
    avatar: "",
    campaign: "Summer Collection Launch",
    date: "May 25, 2025",
    status: "pending",
    message: "I love your brand and would be excited to collaborate on the summer collection. My audience loves fashion content and I've had great engagement with similar products in the past. I can create both static posts and reels featuring your items styled in different ways.",
    categories: ["Fashion", "Summer", "Instagram"],
    match: 95,
    isNew: true,
    budget: "$1500-2000",
    audienceSize: "120K",
    engagement: "3.8%",
    notes: ["Good fit for summer collection", "Previous fashion experience noted"]
  },
  {
    id: 2,
    creatorName: "Jamie Smith",
    creatorHandle: "@jamiesmith",
    avatar: "",
    campaign: "Fall Product Line",
    date: "May 23, 2025",
    status: "approved",
    message: "I've been a fan of your products for years and would love to showcase them to my followers. My audience is primarily interested in sustainable fashion and lifestyle content, which aligns perfectly with your brand values. I could create a series of posts showing how versatile your fall collection is.",
    categories: ["Fashion", "Review"],
    match: 88,
    isNew: false,
    budget: "$800-1200",
    audienceSize: "85K",
    engagement: "4.2%"
  },
  {
    id: 3,
    creatorName: "Taylor Wilson",
    creatorHandle: "@taylorwilson",
    avatar: "",
    campaign: "Summer Collection Launch",
    date: "May 20, 2025",
    status: "rejected",
    message: "Your summer collection would be a perfect fit for my content calendar. I have some great ideas to showcase these pieces in my upcoming travel series. I can highlight how versatile they are for different occasions and locations. My audience is very responsive to lifestyle and travel content.",
    categories: ["Lifestyle", "Instagram", "Stories"],
    match: 75,
    isNew: false,
    budget: "$700",
    audienceSize: "50K",
    engagement: "2.9%"
  },
  {
    id: 4,
    creatorName: "Morgan Lee",
    creatorHandle: "@morganlee",
    avatar: "",
    campaign: "Winter Essentials",
    date: "May 22, 2025",
    status: "in_discussion",
    message: "I'd love to collaborate on your winter essentials campaign. My audience is primarily in colder climates and always looks forward to my winter fashion recommendations. I can create both indoor and outdoor content showcasing how your items perform in real winter conditions.",
    categories: ["Fashion", "Winter", "Lifestyle"],
    match: 92,
    isNew: true,
    budget: "$1000-1500",
    audienceSize: "95K",
    engagement: "3.5%",
    notes: ["Strong winter content history", "Audience demographics match target"]
  }
];

export function ApplicationReview() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [applications, setApplications] = useState<Application[]>(APPLICATIONS);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedApplications, setSelectedApplications] = useState<number[]>([]);
  const { toast } = useToast();
  const [filterValues, setFilterValues] = useState({
    search: "",
    campaign: "all",
    minMatch: 0,
    maxMatch: 100,
    sortBy: "newest"
  });

  const handleApprove = (id: number) => {
    setApplications(apps => apps.map(app =>
      app.id === id ? { ...app, status: "approved", isNew: false } : app
    ));
    toast({
      title: "Application approved",
      description: "The creator has been notified of your decision.",
    });
  };

  const handleReject = (id: number) => {
    setApplications(apps => apps.map(app =>
      app.id === id ? { ...app, status: "rejected", isNew: false } : app
    ));
    toast({
      title: "Application rejected",
      description: "The creator has been notified of your decision.",
    });
  };

  const handleDiscuss = (id: number) => {
    setApplications(apps => apps.map(app =>
      app.id === id ? { ...app, status: "in_discussion", isNew: false } : app
    ));
    toast({
      title: "Application moved to discussion",
      description: "You can now message the creator directly.",
    });
  };

  const tabFiltered = (tab: string) =>
    tab === "all" ? applications : applications.filter(a => a.status === tab as Status);

  const filteredApplications = (tab: string) => {
    let filtered = tabFiltered(tab);

    if (filterValues.search) {
      const searchLower = filterValues.search.toLowerCase();
      filtered = filtered.filter(app => 
        app.creatorName.toLowerCase().includes(searchLower) || 
        app.creatorHandle.toLowerCase().includes(searchLower) ||
        app.campaign.toLowerCase().includes(searchLower)
      );
    }

    if (filterValues.campaign !== "all") {
      filtered = filtered.filter(app => app.campaign === filterValues.campaign);
    }

    filtered = filtered.filter(app => 
      app.match >= filterValues.minMatch && app.match <= filterValues.maxMatch
    );

    switch (filterValues.sortBy) {
      case "newest":
        break;
      case "highestMatch":
        filtered = [...filtered].sort((a, b) => b.match - a.match);
        break;
      case "largestAudience":
        filtered = [...filtered].sort((a, b) => {
          const aSize = parseInt(a.audienceSize?.replace(/[^\d]/g, '') || "0");
          const bSize = parseInt(b.audienceSize?.replace(/[^\d]/g, '') || "0");
          return bSize - aSize;
        });
        break;
      case "highestEngagement":
        filtered = [...filtered].sort((a, b) => {
          const aEng = parseFloat(a.engagement?.replace('%', '') || "0");
          const bEng = parseFloat(b.engagement?.replace('%', '') || "0");
          return bEng - aEng;
        });
        break;
    }

    return filtered;
  };

  const handleViewDetail = (application: Application) => {
    setSelectedApplication(application);
    setDetailPanelOpen(true);
  };

  const toggleApplicationSelection = (id: number) => {
    if (selectedApplications.includes(id)) {
      setSelectedApplications(selectedApplications.filter(appId => appId !== id));
    } else {
      setSelectedApplications([...selectedApplications, id]);
    }
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

  const handleAddNote = (id: number, note: string) => {
    setApplications(apps => apps.map(app =>
      app.id === id ? { 
        ...app, 
        notes: app.notes ? [...app.notes, note] : [note] 
      } : app
    ));
    toast({
      title: "Note added",
      description: "Your note has been saved to this application."
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold font-space">Creator Applications</h1>
        
        <div className="flex flex-wrap gap-2">
          {selectedApplications.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-muted">
                {selectedApplications.length} selected
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    Bulk Actions <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleBulkAction("approve")}>
                    <Check className="mr-2 h-4 w-4 text-green-600" />
                    Approve Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("reject")}>
                    <X className="mr-2 h-4 w-4 text-red-600" />
                    Reject Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("discuss")}>
                    <Check className="mr-2 h-4 w-4 text-blue-600" />
                    Move to Discussion
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBulkMessage}>
                    Send Message to Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setSelectedApplications([])}
            disabled={selectedApplications.length === 0}
          >
            Clear Selection
          </Button>
        </div>
      </div>

      <ApplicationFilterBar 
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        availableCampaigns={Array.from(new Set(applications.map(app => app.campaign)))}
      />

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="in_discussion">In Discussion</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        {["all", "pending", "approved", "in_discussion", "rejected"].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications(tab).length > 0 ? (
                filteredApplications(tab).map(application => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDiscuss={handleDiscuss}
                    onViewProfile={() => handleViewDetail(application)}
                    isSelected={selectedApplications.includes(application.id)}
                    onToggleSelection={() => toggleApplicationSelection(application.id)}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center py-16 animate-fade-in">
                  <span className="text-5xl mb-2">🕵️‍♂️</span>
                  <h2 className="text-lg font-semibold mb-1">No applications found</h2>
                  <p className="text-muted-foreground mb-2">Try another tab or adjust your filters.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <ApplicationDetailPanel 
        application={selectedApplication}
        isOpen={detailPanelOpen}
        onClose={() => setDetailPanelOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        onDiscuss={handleDiscuss}
        onAddNote={handleAddNote}
      />
    </div>
  );
}
