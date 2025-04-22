
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for demonstration
const CREATORS = [
  {
    id: 1,
    name: "Alex Johnson",
    handle: "@alexcreates",
    avatar: "",
    categories: ["Fashion", "Lifestyle"],
    followers: "125K",
    engagementRate: "3.2%",
    location: "New York, USA"
  },
  {
    id: 2,
    name: "Jamie Smith",
    handle: "@jamiesmith",
    avatar: "",
    categories: ["Travel", "Photography"],
    followers: "87K",
    engagementRate: "4.5%",
    location: "London, UK"
  },
  {
    id: 3,
    name: "Taylor Wilson",
    handle: "@taylorwilson",
    avatar: "",
    categories: ["Beauty", "Skincare"],
    followers: "210K",
    engagementRate: "2.8%",
    location: "Los Angeles, USA"
  }
];

export function CreatorDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    categories: [] as string[],
    minFollowers: 0,
    location: "",
  });
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Discover Creators</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search creators..." 
              className="pl-8 w-[200px] sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium">Filter Creators</h3>
              <Separator />
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {["Fashion", "Beauty", "Travel", "Food", "Fitness", "Tech"].map((category) => (
                    <Badge 
                      key={category} 
                      variant={filters.categories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          categories: prev.categories.includes(category)
                            ? prev.categories.filter(c => c !== category)
                            : [...prev.categories, category]
                        }));
                      }}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Follower Count</h4>
                <div className="flex flex-wrap gap-2">
                  {["Any", "10K+", "50K+", "100K+", "500K+", "1M+"].map((range) => (
                    <Badge 
                      key={range} 
                      variant={range === "Any" && filters.minFollowers === 0 ? "default" : "outline"}
                      className="cursor-pointer"
                    >
                      {range}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Location</h4>
                <Input 
                  placeholder="e.g. New York, London..." 
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              
              <Button className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          {CREATORS.map((creator) => (
            <Card key={creator.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{creator.name}</h3>
                        <p className="text-muted-foreground">{creator.handle}</p>
                      </div>
                      <Button size="sm" className="mt-2 sm:mt-0">View Profile</Button>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      {creator.categories.map((category) => (
                        <Badge key={category} variant="secondary">{category}</Badge>
                      ))}
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                      <span>{creator.followers} followers</span>
                      <span>{creator.engagementRate} engagement</span>
                      <span>{creator.location}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
