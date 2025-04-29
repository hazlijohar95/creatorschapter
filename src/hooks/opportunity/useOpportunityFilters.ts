
import { useState, useMemo } from "react";
import { FilterOptions, Opportunity } from "@/components/dashboard/types/opportunity";

export function useOpportunityFilters(opportunities: Opportunity[]) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    categories: [],
    minBudget: null,
    maxBudget: null,
    sortBy: "relevance",
  });

  // Filter opportunities based on active filters
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
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
  }, [opportunities, filters]);

  // Sort opportunities based on filters
  const sortedOpportunities = useMemo(() => {
    return [...filteredOpportunities].sort((a, b) => {
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
  }, [filteredOpportunities, filters.sortBy]);

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      categories: [],
      minBudget: null,
      maxBudget: null,
      sortBy: "relevance",
    });
  };

  return {
    filters,
    setFilters,
    filteredOpportunities: sortedOpportunities,
    handleClearFilters
  };
}
