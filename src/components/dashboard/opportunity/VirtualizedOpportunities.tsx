
import { useEffect, useState } from "react";
import { VirtualizedList } from "@/components/shared/VirtualizedList";
import { OpportunityCard } from "./OpportunityCard";
import { Opportunity } from "../types/opportunity";

interface VirtualizedOpportunitiesProps {
  opportunities: Opportunity[];
  onViewOpportunity: (id: string) => void;
  itemHeight?: number;
  listHeight?: number;
  className?: string;
}

export function VirtualizedOpportunities({
  opportunities,
  onViewOpportunity,
  itemHeight = 320,
  listHeight = 800,
  className = "",
}: VirtualizedOpportunitiesProps) {
  const [mounted, setMounted] = useState(false);

  // Handle initial render to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder while client-side rendering kicks in
    return (
      <div className={`space-y-4 ${className}`}>
        {opportunities.slice(0, 3).map((opp) => (
          <div 
            key={opp.id}
            className="bg-muted/20 animate-pulse h-80 rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <p className="text-muted-foreground">No opportunities found</p>
      </div>
    );
  }

  const renderOpportunity = (opportunity: Opportunity) => (
    <div className="p-2">
      <OpportunityCard 
        opportunity={opportunity} 
        onViewOpportunity={onViewOpportunity} 
      />
    </div>
  );

  return (
    <VirtualizedList
      items={opportunities}
      height={listHeight}
      itemSize={itemHeight}
      renderItem={renderOpportunity}
      itemKey={(index, data) => data[index].id}
      className={className}
    />
  );
}
