
import { useState, useEffect } from "react";
import { OpportunityTabs } from "./opportunity/OpportunityTabs";
import { OpportunityContent } from "./opportunity/OpportunityContent";
import { OpportunitySummary } from "./OpportunitySummary";
import { OpportunityDetailModal } from "./opportunity/OpportunityDetailModal";
import { Application, FilterOptions, Opportunity, OpportunityTab } from "./types/opportunity";
import { toast } from "sonner";

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
        
        const recommended = [...mockData]
          .sort((a, b) => b.match - a.match)
          .slice(0, 3);
        setRecommendedOpportunities(recommended);
        
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

  const handleClearFilters = () => {
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
      <OpportunitySummary
        total={opportunities.length}
        shown={filteredOpportunities.length}
        searchQuery={filters.search}
      />

      <OpportunityTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        applicationsCount={applications.length}
      />

      <OpportunityContent
        activeTab={activeTab}
        opportunities={opportunities}
        filteredOpportunities={sortedOpportunities}
        recommendedOpportunities={recommendedOpportunities}
        applications={applications}
        isLoading={isLoading}
        filters={filters}
        onFilterChange={setFilters}
        onViewOpportunity={handleViewOpportunity}
        onMessageBrand={handleMessageBrand}
        onViewApplication={handleViewApplication}
        onClearFilters={handleClearFilters}
      />

      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onApply={handleApply}
      />
    </div>
  );
}
