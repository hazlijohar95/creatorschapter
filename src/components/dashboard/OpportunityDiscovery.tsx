
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Application, FilterOptions, Opportunity, OpportunityTab } from "./types/opportunity";
import { ApplicationsManagement } from "./opportunity/ApplicationsManagement";
import { OpportunityDetailModal } from "./opportunity/OpportunityDetailModal";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_APPLICATIONS, MOCK_OPPORTUNITIES } from "./opportunity/mockData";
import { OpportunityHeader } from "./opportunity/OpportunityHeader";
import { OpportunityTabContent } from "./opportunity/OpportunityTabContent";

export default function OpportunityDiscovery() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendedOpportunities, setRecommendedOpportunities] = useState<Opportunity[]>([]);
  const [activeTab, setActiveTab] = useState<OpportunityTab>("discover");
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    categories: [],
    minBudget: null,
    maxBudget: null,
    sortBy: "relevance",
  });

  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true);
      try {
        setOpportunities(MOCK_OPPORTUNITIES);
        
        const recommended = [...MOCK_OPPORTUNITIES]
          .sort((a, b) => b.match - a.match)
          .slice(0, 3);
        setRecommendedOpportunities(recommended);
        
        setApplications(MOCK_APPLICATIONS);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        toast.error("Failed to load opportunities. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const filteredOpportunities = opportunities.filter((opp) => {
    const searchMatch =
      filters.search === "" ||
      opp.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      opp.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      opp.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      opp.tags.some((tag) =>
        tag.toLowerCase().includes(filters.search.toLowerCase())
      );

    const categoryMatch =
      filters.categories.length === 0 ||
      filters.categories.some((cat) => opp.tags.includes(cat));
    
    const budgetLower = opp.budget.match(/\$(\d+)/);
    const budgetUpper = opp.budget.match(/\-\$?(\d+)/);
    
    const minBudget = budgetLower ? parseInt(budgetLower[1]) : 0;
    const maxBudget = budgetUpper ? parseInt(budgetUpper[1]) : minBudget;
    
    const budgetMatch =
      (filters.minBudget === null || maxBudget >= filters.minBudget) &&
      (filters.maxBudget === null || minBudget <= filters.maxBudget);

    return searchMatch && categoryMatch && budgetMatch;
  });

  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    if (filters.sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (filters.sortBy === "budget") {
      const aBudgetMatch = a.budget.match(/\$(\d+)/);
      const bBudgetMatch = b.budget.match(/\$(\d+)/);
      const aBudget = aBudgetMatch ? parseInt(aBudgetMatch[1]) : 0;
      const bBudget = bBudgetMatch ? parseInt(bBudgetMatch[1]) : 0;
      return bBudget - aBudget;
    } else {
      return b.match - a.match;
    }
  });

  const handleApply = async (opportunityId: string, message: string) => {
    try {
      console.log("Submitting application:", { opportunityId, message });
      
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

  const handleViewOpportunity = (opportunityId: string) => {
    const opportunity = opportunities.find((o) => o.id === opportunityId);
    if (opportunity) {
      setSelectedOpportunity(opportunity);
      setIsDetailModalOpen(true);
    }
  };

  const handleViewApplication = (applicationId: string) => {
    const application = applications.find((a) => a.id === applicationId);
    if (application) {
      setSelectedApplication(application);
      setIsApplicationDialogOpen(true);
      
      const opportunityId = application.opportunity.id;
      const fullOpportunity = opportunities.find((o) => o.id === opportunityId);
      if (fullOpportunity) {
        setSelectedOpportunity(fullOpportunity);
      }
    }
  };

  const handleMessageBrand = (applicationId: string) => {
    toast.info("Messaging feature will be implemented in a future update.");
    console.log("Opening messages for application:", applicationId);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      categories: [],
      minBudget: null,
      maxBudget: null,
      sortBy: "relevance",
    });
  };

  return (
    <div className="space-y-8 pb-12 px-4 md:px-8 max-w-[1300px] mx-auto animate-fade-in">
      <OpportunityHeader
        totalOpportunities={opportunities.length}
        filteredCount={filteredOpportunities.length}
        searchQuery={filters.search}
        filters={filters}
        onFilterChange={setFilters}
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
          <OpportunityTabContent
            sortedOpportunities={sortedOpportunities}
            recommendedOpportunities={recommendedOpportunities}
            isLoading={isLoading}
            onViewOpportunity={handleViewOpportunity}
            filters={filters}
            resetFilters={resetFilters}
          />
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-4">
          <ApplicationsManagement
            applications={applications}
            onViewDetails={handleViewApplication}
            onMessageBrand={handleMessageBrand}
          />
        </TabsContent>
      </Tabs>

      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onApply={handleApply}
      />

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
