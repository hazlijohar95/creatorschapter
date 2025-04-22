
import { Search, Filter, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCreators, DiscoverableCreator } from "./hooks/useCreators";
import { useCreatorFilters } from "./hooks/useCreatorFilters";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from "@/components/ui/pagination";

const CATEGORY_OPTIONS = ["Fashion", "Beauty", "Travel", "Food", "Fitness", "Tech", "Lifestyle", "Gaming", "Music", "Art"];
const FOLLOWER_RANGES = ["Any", "10K+", "50K+", "100K+", "500K+", "1M+"];

export function CreatorDiscovery() {
  const {
    filters,
    toggleCategory,
    setFollowerRange,
    setLocation,
    setSearchQuery,
    page,
    setPage
  } = useCreatorFilters();
  
  const { creators, loading, error, pageCount } = useCreators({
    ...filters,
    page,
    pageSize: 5
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
              value={filters.searchQuery}
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
                  {CATEGORY_OPTIONS.map((category) => (
                    <Badge 
                      key={category} 
                      variant={filters.categories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Follower Count</h4>
                <div className="flex flex-wrap gap-2">
                  {FOLLOWER_RANGES.map((range) => (
                    <Badge 
                      key={range} 
                      variant={
                        (range === "Any" && filters.minFollowers === 0) ||
                        (range === "10K+" && filters.minFollowers === 10000) ||
                        (range === "50K+" && filters.minFollowers === 50000) ||
                        (range === "100K+" && filters.minFollowers === 100000) ||
                        (range === "500K+" && filters.minFollowers === 500000) ||
                        (range === "1M+" && filters.minFollowers === 1000000)
                          ? "default" 
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => setFollowerRange(range)}
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
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full"
                onClick={() => {
                  // This will reset to only applied filters as the hooks already handle filter changes
                  setPage(1);
                }}
              >
                Apply Filters
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-red-500 mb-2">Error loading creators</div>
                <p>{error.message}</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
              </CardContent>
            </Card>
          ) : creators.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-lg font-medium mb-2">No creators found</div>
                <p className="text-muted-foreground">Try adjusting your filters or search query</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {creators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
              
              {pageCount > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    {page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious onClick={() => setPage(page - 1)} className="cursor-pointer" />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink 
                            isActive={pageNumber === page}
                            onClick={() => setPage(pageNumber)}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {page < pageCount && (
                      <PaginationItem>
                        <PaginationNext onClick={() => setPage(page + 1)} className="cursor-pointer" />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface CreatorCardProps {
  creator: DiscoverableCreator;
}

function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <Card key={creator.id} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback>{creator.name.substring(0, 2).toUpperCase()}</AvatarFallback>
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
              {creator.categories.slice(0, 3).map((category) => (
                <Badge key={category} variant="secondary">{category}</Badge>
              ))}
              {creator.categories.length > 3 && (
                <Badge variant="outline">+{creator.categories.length - 3}</Badge>
              )}
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
  );
}
