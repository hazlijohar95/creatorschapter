
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { OpportunitySummary } from "./OpportunitySummary";
import { OpportunityFilters } from "./opportunity/OpportunityFilters";
import { OpportunityDetailModal } from "./opportunity/OpportunityDetailModal";
import { ApplicationsManagement } from "./opportunity/ApplicationsManagement";
import { RecommendedOpportunities } from "./opportunity/RecommendedOpportunities";
import { Application, FilterOptions, Opportunity, OpportunityTab } from "./types/opportunity";
import { toast } from "sonner";

export default function OpportunityDiscovery() {
  // States for opportunities and applications
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendedOpportunities, setRecommendedOpportunities] = useState<Opportunity[]>([]);
  
  // States for UI management
  const [activeTab, setActiveTab] = useState<OpportunityTab>("discover");
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for filtering
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    categories: [],
    minBudget: null,
    maxBudget: null,
    sortBy: "relevance",
  });

  // Fetch opportunities
  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true);
      try {
        // This would normally be an API call
        // For now, we'll use mock data
        const mockData: Opportunity[] = [
          {
            id: "1",
            title: "Instagram Story Campaign",
            company: "Fitness Brand",
            budget: "$500-750",
            description: "Looking for fitness influencers to create Instagram Stories highlighting our new protein shakes. Must have an audience interested in fitness and nutrition.",
            match: 95,
            tags: ["Instagram", "Stories", "Fitness"],
            deadline: "2025-05-15",
            isNew: true,
            createdAt: "2025-04-20T10:30:00Z",
          },
          {
            id: "2",
            title: "YouTube Product Review",
            company: "Tech Company",
            budget: "$1000-1500",
            description: "We're seeking tech reviewers to create an in-depth review of our latest smartphone. Must have experience reviewing tech products and a sizable YouTube audience.",
            match: 88,
            tags: ["YouTube", "Tech", "Review"],
            deadline: "2025-05-20",
            isNew: true,
            createdAt: "2025-04-19T15:45:00Z",
          },
          {
            id: "3",
            title: "Podcast Guest Appearance",
            company: "Media Company",
            budget: "$300",
            description: "Join our podcast as a guest to discuss content creation strategies. Looking for experienced creators with unique perspectives.",
            match: 75,
            tags: ["Podcast", "Guest", "Content Strategy"],
            deadline: "2025-05-25",
            isNew: false,
            createdAt: "2025-04-15T09:20:00Z",
          },
          {
            id: "4",
            title: "Blog Post Collaboration",
            company: "Lifestyle Brand",
            budget: "$200-400",
            description: "Write an insightful blog post about sustainable living. Audience should be interested in eco-friendly lifestyle choices.",
            match: 70,
            tags: ["Blog", "Sustainability", "Lifestyle"],
            deadline: "2025-05-30",
            isNew: false,
            createdAt: "2025-04-10T14:15:00Z",
          },
          {
            id: "5",
            title: "TikTok Dance Challenge",
            company: "Music Label",
            budget: "$800-1200",
            description: "Create a viral dance challenge for our upcoming song release. Looking for creators with a strong presence in dance and music content.",
            match: 92,
            tags: ["TikTok", "Dance", "Music"],
            deadline: "2025-05-10",
            isNew: true,
            createdAt: "2025-04-22T11:30:00Z",
          },
          {
            id: "6",
            title: "Beauty Product Review Series",
            company: "Cosmetics Brand",
            budget: "$600-900",
            description: "Create a series of reviews featuring our new skincare line. Ideal for beauty influencers with a focus on skincare routines.",
            match: 83,
            tags: ["Beauty", "Skincare", "Review"],
            deadline: "2025-06-05",
            isNew: false,
            createdAt: "2025-04-08T16:45:00Z",
          },
        ];
        
        setOpportunities(mockData);
        
        // Set recommended opportunities (highest match scores)
        const recommended = [...mockData]
          .sort((a, b) => b.match - a.match)
          .slice(0, 3);
        setRecommendedOpportunities(recommended);
        
        // Mock applications data
        const mockApplications: Application[] = [
          {
            id: "app1",
            opportunity: {
              id: "2",
              title: "YouTube Product Review",
              company: "Tech Company",
              budget: "$1000-1500",
            },
            status: "pending",
            appliedDate: "April 21, 2025",
            lastUpdateDate: "April 21, 2025",
            message: "I've been reviewing tech products for over 3 years and would love to collaborate on this opportunity. My audience is very engaged with tech content.",
          },
          {
            id: "app2",
            opportunity: {
              id: "5",
              title: "TikTok Dance Challenge",
              company: "Music Label",
              budget: "$800-1200",
            },
            status: "approved",
            appliedDate: "April 18, 2025",
            lastUpdateDate: "April 19, 2025",
            message: "I'm a dance content creator with over 100K followers on TikTok. I'd love to create a dance challenge for your upcoming song release!",
            brandResponse: "We're excited to work with you! Let's discuss the details soon."
          },
        ];
        
        setApplications(mockApplications);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        toast.error("Failed to load opportunities. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Apply filters to the opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    // Search filter
    const searchMatch =
      filters.search === "" ||
      opp.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      opp.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      opp.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      opp.tags.some((tag) =>
        tag.toLowerCase().includes(filters.search.toLowerCase())
      );

    // Category filter
    const categoryMatch =
      filters.categories.length === 0 ||
      filters.categories.some((cat) => opp.tags.includes(cat));
    
    // Budget filter (extract numeric value from budget string for comparison)
    const budgetLower = opp.budget.match(/\$(\d+)/);
    const budgetUpper = opp.budget.match(/\-\$?(\d+)/);
    
    const minBudget = budgetLower ? parseInt(budgetLower[1]) : 0;
    const maxBudget = budgetUpper ? parseInt(budgetUpper[1]) : minBudget;
    
    const budgetMatch =
      (filters.minBudget === null || maxBudget >= filters.minBudget) &&
      (filters.maxBudget === null || minBudget <= filters.maxBudget);

    return searchMatch && categoryMatch && budgetMatch;
  });

  // Sort the filtered opportunities
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    if (filters.sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (filters.sortBy === "budget") {
      // Extract and compare budget values
      const aBudgetMatch = a.budget.match(/\$(\d+)/);
      const bBudgetMatch = b.budget.match(/\$(\d+)/);
      const aBudget = aBudgetMatch ? parseInt(aBudgetMatch[1]) : 0;
      const bBudget = bBudgetMatch ? parseInt(bBudgetMatch[1]) : 0;
      return bBudget - aBudget;
    } else {
      // Default: sort by relevance (match score)
      return b.match - a.match;
    }
  });

  // Handle applying to an opportunity
  const handleApply = async (opportunityId: string, message: string) => {
    try {
      // This would normally be an API call
      console.log("Submitting application:", { opportunityId, message });
      
      // Mock successful application
      const opportunity = opportunities.find((o) => o.id === opportunityId);
      if (!opportunity) throw new Error("Opportunity not found");
      
      const newApplication: Application = {
        id: `app${Date.now()}`,
        opportunity: {
          id: opportunity.id,
          title: opportunity.title,
          company: opportunity.company,
          budget: opportunity.budget,
        },
        status: "pending",
        appliedDate: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        lastUpdateDate: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        message,
      };
      
      setApplications((prev) => [...prev, newApplication]);
      return Promise.resolve();
    } catch (error) {
      console.error("Error applying to opportunity:", error);
      return Promise.reject(error);
    }
  };

  // Handle viewing opportunity details
  const handleViewOpportunity = (opportunityId: string) => {
    const opportunity = opportunities.find((o) => o.id === opportunityId);
    if (opportunity) {
      setSelectedOpportunity(opportunity);
      setIsDetailModalOpen(true);
    }
  };

  // Handle viewing application details
  const handleViewApplication = (applicationId: string) => {
    const application = applications.find((a) => a.id === applicationId);
    if (application) {
      setSelectedApplication(application);
      setIsApplicationDialogOpen(true);
      
      // Find the full opportunity details
      const opportunityId = application.opportunity.id;
      const fullOpportunity = opportunities.find((o) => o.id === opportunityId);
      if (fullOpportunity) {
        setSelectedOpportunity(fullOpportunity);
      }
    }
  };

  // Handle messaging a brand
  const handleMessageBrand = (applicationId: string) => {
    toast.info("Messaging feature will be implemented in a future update.");
    // This would normally navigate to or open a messaging interface
    console.log("Opening messages for application:", applicationId);
  };

  return (
    <div className="space-y-8 pb-12 px-4 md:px-8 max-w-[1300px] mx-auto animate-fade-in">
      <OpportunitySummary
        total={opportunities.length}
        shown={filteredOpportunities.length}
        searchQuery={filters.search}
      />

      <Tabs 
        defaultValue="discover" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as OpportunityTab)}
        className="space-y-6"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="discover">Discover Opportunities</TabsTrigger>
          <TabsTrigger value="applications">
            My Applications
            {applications.length > 0 && (
              <span className="ml-1.5 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                {applications.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="discover" className="space-y-8">
          {/* Filters Section */}
          <OpportunityFilters
            filters={filters}
            onFilterChange={setFilters}
            totalOpportunities={opportunities.length}
            filteredCount={filteredOpportunities.length}
          />

          {/* Recommended Section - shown at the top */}
          {filters.search === "" && filters.categories.length === 0 && (
            <RecommendedOpportunities
              opportunities={recommendedOpportunities}
              onViewOpportunity={handleViewOpportunity}
            />
          )}

          {/* Main Opportunities Grid */}
          <div>
            <h2 className="text-lg font-semibold font-space mb-4">
              {filters.search || filters.categories.length > 0
                ? "Search Results"
                : "Available Opportunities"}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-2">
              {isLoading ? (
                // Loading state - skeleton cards
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse border h-[280px] rounded-lg bg-muted/40"
                  >
                    <div className="h-24 bg-muted rounded-t-lg" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-16 bg-muted rounded w-full" />
                      <div className="h-8 bg-muted rounded w-full" />
                    </div>
                  </div>
                ))
              ) : sortedOpportunities.length > 0 ? (
                sortedOpportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    onViewOpportunity={handleViewOpportunity}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center mt-8 py-16">
                  <span className="text-4xl mb-2">😕</span>
                  <h2 className="text-lg font-semibold mb-2">No opportunities found</h2>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters to find more opportunities.
                  </p>
                  {(filters.search || filters.categories.length > 0) && (
                    <Button
                      onClick={() =>
                        setFilters({
                          search: "",
                          categories: [],
                          minBudget: null,
                          maxBudget: null,
                          sortBy: "relevance",
                        })
                      }
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-4">
          <ApplicationsManagement
            applications={applications}
            onViewDetails={handleViewApplication}
            onMessageBrand={handleMessageBrand}
          />
        </TabsContent>
      </Tabs>

      {/* Opportunity Detail Modal */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onApply={handleApply}
      />

      {/* Application Detail Dialog */}
      <AlertDialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
        <AlertDialogContent className="max-w-xl">
          {selectedApplication && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Application Details</AlertDialogTitle>
                <AlertDialogDescription>
                  Submitted on {selectedApplication.appliedDate}
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="py-4 space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Status</h3>
                  <div className="flex items-center">
                    {selectedApplication.status === "pending" && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Pending Review
                      </Badge>
                    )}
                    {selectedApplication.status === "approved" && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Approved
                      </Badge>
                    )}
                    {selectedApplication.status === "rejected" && (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        Not Selected
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Opportunity</h3>
                  <p>
                    {selectedApplication.opportunity.title} with{" "}
                    {selectedApplication.opportunity.company}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Budget: {selectedApplication.opportunity.budget}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Your Message</h3>
                  <p className="text-sm">{selectedApplication.message}</p>
                </div>
                
                {selectedApplication.brandResponse && (
                  <div>
                    <h3 className="font-medium mb-1">Brand Response</h3>
                    <p className="text-sm">{selectedApplication.brandResponse}</p>
                  </div>
                )}
              </div>
              
              <AlertDialogFooter>
                <Button variant="outline" onClick={() => setIsApplicationDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => handleMessageBrand(selectedApplication.id)}>
                  Message Brand
                </Button>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// The OpportunityCard component
function OpportunityCard({
  opportunity,
  onViewOpportunity,
}: {
  opportunity: Opportunity;
  onViewOpportunity: (id: string) => void;
}) {
  // Color-coding for match progress
  let matchColor = "bg-orange-500";
  if (opportunity.match >= 90) matchColor = "bg-green-500";
  else if (opportunity.match >= 80) matchColor = "bg-blue-500";
  else if (opportunity.match >= 70) matchColor = "bg-yellow-500";

  return (
    <div className="flex flex-col h-full overflow-hidden shadow-md border-[1.5px] transition-transform duration-150 hover:scale-[1.03] hover:shadow-xl animate-fade-in bg-card rounded-lg">
      <div className="pb-3 bg-gradient-to-br from-background/70 via-background/90 to-white/0 p-4">
        <div className="flex justify-between items-center w-full mb-1">
          <div className="flex flex-col">
            <h3 className="text-lg font-space font-semibold">{opportunity.title}</h3>
            <p className="pt-0 text-[15px] text-muted-foreground">
              {opportunity.company} &bull; <span className="font-semibold">{opportunity.budget}</span>
            </p>
          </div>
          {opportunity.isNew ? (
            <span className="text-xs px-2 py-1 rounded-full font-bold border bg-green-100 text-green-800 border-green-200">
              New
            </span>
          ) : (
            <span className="text-xs px-2 py-1 rounded-full font-bold border bg-blue-50 text-blue-700 border-blue-100">
              Due in {new Date(opportunity.deadline).getDate() - new Date().getDate()}d
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {opportunity.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-secondary/60 border-0 text-sm px-3 py-0.5 text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="p-4 flex-1">
        <p className="text-[15px] text-gray-600 mb-3 min-h-[60px] line-clamp-3">
          {opportunity.description}
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Match score:</span>
            <span className="font-semibold text-sm">{opportunity.match}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${matchColor}`}
              style={{ width: `${opportunity.match}%` }}
            />
          </div>
        </div>
      </div>
      <div className="mt-auto border-t bg-muted/40 p-4 flex justify-between items-center">
        <div className="text-xs text-muted-foreground font-medium">
          <span className="font-semibold">Deadline:</span> {opportunity.deadline}
        </div>
        <Button
          size="sm"
          className="shadow-sm font-semibold"
          onClick={() => onViewOpportunity(opportunity.id)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
