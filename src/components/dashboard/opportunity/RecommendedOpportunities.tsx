import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThumbsUp } from "lucide-react";
import { Opportunity } from "../types/opportunity";
import { VirtualizedOpportunities } from "./VirtualizedOpportunities";

interface RecommendedOpportunitiesProps {
  opportunities: Opportunity[];
  onViewOpportunity: (opportunityId: string) => void;
  useVirtualization?: boolean;
}

export function RecommendedOpportunities({
  opportunities,
  onViewOpportunity,
  useVirtualization = false,
}: RecommendedOpportunitiesProps) {
  if (!opportunities.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ThumbsUp className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold font-space">Recommended For You</h2>
      </div>

      {useVirtualization && opportunities.length > 10 ? (
        <VirtualizedOpportunities 
          opportunities={opportunities.slice(0, 10)} 
          onViewOpportunity={onViewOpportunity}
          listHeight={500}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.slice(0, 3).map((opportunity) => (
            <RecommendedCard
              key={opportunity.id}
              opportunity={opportunity}
              onViewOpportunity={onViewOpportunity}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface RecommendedCardProps {
  opportunity: Opportunity;
  onViewOpportunity: (opportunityId: string) => void;
}

function RecommendedCard({
  opportunity,
  onViewOpportunity,
}: RecommendedCardProps) {
  let matchColor = "bg-orange-500";
  if (opportunity.match >= 90) matchColor = "bg-green-500";
  else if (opportunity.match >= 80) matchColor = "bg-blue-500";
  else if (opportunity.match >= 70) matchColor = "bg-yellow-500";

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3 bg-gradient-to-br from-background/80 to-muted/20">
        <div className="flex justify-between items-start mb-1">
          <CardTitle className="text-base font-space line-clamp-1">
            {opportunity.title}
          </CardTitle>
          <Badge className="bg-primary/10 text-primary border-primary/20 whitespace-nowrap">
            {opportunity.match}% Match
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">{opportunity.company}</div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {opportunity.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-2">
          {opportunity.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {opportunity.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{opportunity.tags.length - 2}
            </Badge>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${matchColor}`}
            style={{ width: `${opportunity.match}%` }}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/40 pt-3 flex justify-between">
        <span className="text-sm font-medium">{opportunity.budget}</span>
        <Button
          size="sm"
          onClick={() => onViewOpportunity(opportunity.id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
