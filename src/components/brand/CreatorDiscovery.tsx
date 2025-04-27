
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useCreators } from "./hooks/useCreators";
import { useCreatorFilters } from "./hooks/useCreatorFilters";
import { CreatorCard } from "./discovery/CreatorCard";
import { CreatorFilters } from "./discovery/CreatorFilters";
import { CreatorSearchBar } from "./discovery/CreatorSearchBar";
import { CreatorProfileDialog } from "./discovery/CreatorProfileDialog";
import { useState } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { DiscoverableCreator } from "./hooks/useCreators";

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

  const [selectedCreator, setSelectedCreator] = useState<DiscoverableCreator | null>(null);

  const selectedFollowerRange = (() => {
    if (filters.minFollowers === 0) return "Any";
    if (filters.minFollowers === 10000) return "10K+";
    if (filters.minFollowers === 50000) return "50K+";
    if (filters.minFollowers === 100000) return "100K+";
    if (filters.minFollowers === 500000) return "500K+";
    if (filters.minFollowers === 1000000) return "1M+";
    return "Any";
  })();
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Discover Creators</h1>
        <CreatorSearchBar 
          searchQuery={filters.searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CreatorFilters
            filters={filters}
            toggleCategory={toggleCategory}
            setLocation={setLocation}
            setFollowerRange={setFollowerRange}
            selectedFollowerRange={selectedFollowerRange}
          />
        </div>
        
        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="p-6">
                <EmptyState
                  title="Error loading creators"
                  description={error.message}
                  action={{
                    label: "Retry",
                    onClick: () => window.location.reload()
                  }}
                />
              </CardContent>
            </Card>
          ) : creators.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <EmptyState
                  icon="🔍"
                  title="No creators found"
                  description="Try adjusting your filters or search query"
                />
              </CardContent>
            </Card>
          ) : (
            <>
              {creators.map((creator) => (
                <CreatorCard 
                  key={creator.id} 
                  creator={creator}
                  onViewProfile={() => setSelectedCreator(creator)}
                />
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

      <CreatorProfileDialog
        creator={selectedCreator}
        onClose={() => setSelectedCreator(null)}
      />
    </div>
  );
}
