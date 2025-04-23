
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookOpen } from "lucide-react";

// OpportunityTags Component
function OpportunityTags({ tags }: { tags: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {tags.map(tag => (
        <Badge
          key={tag}
          variant="secondary"
          className="bg-gray-100 text-gray-800 border-0"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}

// OpportunityCard Component
interface Opportunity {
  id: string;
  title: string;
  company: string;
  budget: string;
  description: string;
  match: number;
  tags: string[];
  deadline: string;
  isNew: boolean;
}
function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  // Color-coding for match progress
  let matchColor = "bg-orange-500";
  if (opportunity.match >= 90) matchColor = "bg-green-500";
  else if (opportunity.match >= 80) matchColor = "bg-blue-500";
  else if (opportunity.match >= 70) matchColor = "bg-yellow-500";

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-sm transition-transform hover:scale-105 hover:shadow-md duration-150">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start w-full">
          <div>
            <CardTitle className="text-lg">{opportunity.title}</CardTitle>
            <CardDescription className="pt-0">{opportunity.company} • <span className="font-semibold">{opportunity.budget}</span></CardDescription>
          </div>
          {opportunity.isNew && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">New</span>
          )}
        </div>
        <OpportunityTags tags={opportunity.tags} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3 line-clamp-4">{opportunity.description}</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Match score:</span>
            <span className="font-semibold text-sm">{opportunity.match}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${matchColor}`} style={{ width: `${opportunity.match}%` }} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto border-t bg-gray-50 pt-3 flex flex-col gap-2">
        <div className="flex justify-between items-center w-full">
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold">Deadline:</span> {opportunity.deadline}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BookOpen className="mr-1 h-4 w-4" />
              View Details
            </Button>
            <Button size="sm">Apply Now</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function OpportunityDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for opportunities
  const opportunities: Opportunity[] = [
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
    },
  ];

  const filteredOpportunities = opportunities.filter(
    opp =>
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-12 px-4 md:px-8 max-w-[1300px] mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search opportunities..."
            className="w-full pl-8 bg-white border-gray-200 shadow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search opportunities"
          />
        </div>
        <Button variant="outline" size="sm" className="flex gap-2 border-gray-200">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredOpportunities.map(opp => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="flex flex-col items-center mt-16">
          <span className="text-4xl mb-2">😕</span>
          <h2 className="text-lg font-semibold mb-2">No opportunities found</h2>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search to find more opportunities.
          </p>
        </div>
      )}
    </div>
  );
}
