
import { useState, useCallback } from "react";

interface CreatorFilters {
  categories: string[];
  minFollowers: number;
  location: string;
  searchQuery: string;
}

export function useCreatorFilters(initialFilters: Partial<CreatorFilters> = {}) {
  const [filters, setFilters] = useState<CreatorFilters>({
    categories: initialFilters.categories || [],
    minFollowers: initialFilters.minFollowers || 0,
    location: initialFilters.location || "",
    searchQuery: initialFilters.searchQuery || ""
  });

  const [page, setPage] = useState(1);
  
  // Reset pagination when filters change
  const updateFilters = useCallback((newFilters: Partial<CreatorFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
    setPage(1);
  }, []);

  const setFollowerRange = useCallback((range: string) => {
    let minFollowers = 0;
    
    switch(range) {
      case "10K+":
        minFollowers = 10000;
        break;
      case "50K+":
        minFollowers = 50000;
        break;
      case "100K+":
        minFollowers = 100000;
        break;
      case "500K+":
        minFollowers = 500000;
        break;
      case "1M+":
        minFollowers = 1000000;
        break;
      default: // "Any"
        minFollowers = 0;
    }
    
    setFilters(prev => ({ ...prev, minFollowers }));
    setPage(1);
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
    setPage(1);
  }, []);

  const setLocation = useCallback((location: string) => {
    setFilters(prev => ({ ...prev, location }));
    setPage(1);
  }, []);

  return {
    filters,
    updateFilters,
    toggleCategory,
    setFollowerRange,
    setSearchQuery,
    setLocation,
    page,
    setPage
  };
}
