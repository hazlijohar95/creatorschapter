
import { Opportunity } from "../types/opportunity";
import { OpportunityCard } from "./OpportunityCard";
import { OpportunityLoadingState } from "./OpportunityLoadingState";
import { OpportunityEmptyState } from "./OpportunityEmptyState";
import { FilterOptions } from "../types/opportunity";

interface OpportunityGridViewProps {
  opportunities: Opportunity[];
  isLoading: boolean;
  onViewOpportunity: (id: string) => void;
  hasFilters: boolean;
  resetFilters: () => void;
}

export function OpportunityGridView({
  opportunities,
  isLoading,
  onViewOpportunity,
  hasFilters,
  resetFilters,
}: OpportunityGridViewProps) {
  if (isLoading) {
    return <OpportunityLoadingState />;
  }

  if (opportunities.length === 0) {
    return <OpportunityEmptyState hasFilters={hasFilters} resetFilters={resetFilters} />;
  }

  return (
    <>
      {opportunities.map((opp) => (
        <OpportunityCard
          key={opp.id}
          opportunity={opp}
          onViewOpportunity={onViewOpportunity}
        />
      ))}
    </>
  );
}
