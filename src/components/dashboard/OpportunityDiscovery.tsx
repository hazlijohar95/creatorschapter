
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, BookOpen } from "lucide-react";

export default function OpportunityDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for opportunities
  const opportunities = [
    {
      id: "1",
      title: "Instagram Story Campaign",
      company: "Fitness Brand",
      budget: "$500-750",
      description: "Looking for fitness influencers to create Instagram Stories highlighting our new protein shake line. Must have audience interested in fitness and nutrition.",
      match: 95,
      tags: ["Instagram", "Stories", "Fitness"],
      deadline: "2025-05-15",
      isNew: true
    },
    {
      id: "2",
      title: "YouTube Product Review",
      company: "Tech Company",
      budget: "$1000-1500",
      description: "We're looking for tech reviewers to create an in-depth review of our new smartphone. Must have experience reviewing tech products.",
      match: 88,
      tags: ["YouTube", "Tech", "Review"],
      deadline: "2025-05-20",
      isNew: true
    },
    {
      id: "3",
      title: "Podcast Guest Appearance",
      company: "Media Company",
      budget: "$300",
      description: "Join our popular podcast as a guest to discuss content creation strategies. Looking for experienced creators with unique perspectives.",
      match: 75,
      tags: ["Podcast", "Guest", "Content Strategy"],
      deadline: "2025-05-25",
      isNew: false
    },
    {
      id: "4",
      title: "Blog Post Collaboration",
      company: "Lifestyle Brand",
      budget: "$200-400",
      description: "Write a blog post about sustainable living practices. Must have audience interested in eco-friendly lifestyle.",
      match: 70,
      tags: ["Blog", "Sustainability", "Lifestyle"],
      deadline: "2025-05-30",
      isNew: false
    }
  ];
  
  const filteredOpportunities = opportunities.filter(
    opp => opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
           opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           opp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">  {/* Added pb-12 for extra bottom padding */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search opportunities..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.map(opp => (
          <Card key={opp.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{opp.title}</CardTitle>
                  <CardDescription className="pt-1">{opp.company} • {opp.budget}</CardDescription>
                </div>
                {opp.isNew && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {opp.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-3">{opp.description}</p>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Match score</span>
                  <span className="font-medium">{opp.match}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      opp.match >= 90 ? "bg-green-500" : 
                      opp.match >= 80 ? "bg-blue-500" : 
                      opp.match >= 70 ? "bg-yellow-500" : "bg-orange-500"
                    }`}
                    style={{ width: `${opp.match}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 pt-3 flex justify-between">
              <Button variant="outline" size="sm">
                <BookOpen className="mr-2 h-4 w-4" />
                View Details
              </Button>
              <Button size="sm">Apply Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
