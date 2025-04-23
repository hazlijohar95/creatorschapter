
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Opportunity } from "../types/opportunity";

export function OpportunityCard({
  opportunity,
  onViewOpportunity,
}: {
  opportunity: Opportunity;
  onViewOpportunity: (id: string) => void;
}) {
  // Color-coding for match progress
  let matchColor = "bg-orange-500";
  if (opportunity.match >= 90) matchColor = "bg-green-500";
  else if (opportunity.match >= 80) matchColor = "bg-blue-500";
  else if (opportunity.match >= 70) matchColor = "bg-yellow-500";

  return (
    <div className="flex flex-col h-full overflow-hidden shadow-md border-[1.5px] transition-transform duration-150 hover:scale-[1.03] hover:shadow-xl animate-fade-in bg-card rounded-lg">
      <div className="pb-3 bg-gradient-to-br from-background/70 via-background/90 to-white/0 p-4">
        <div className="flex justify-between items-center w-full mb-1">
          <div className="flex flex-col">
            <h3 className="text-lg font-space font-semibold">{opportunity.title}</h3>
            <p className="pt-0 text-[15px] text-muted-foreground">
              {opportunity.company} &bull; <span className="font-semibold">{opportunity.budget}</span>
            </p>
          </div>
          {opportunity.isNew ? (
            <span className="text-xs px-2 py-1 rounded-full font-bold border bg-green-100 text-green-800 border-green-200">
              New
            </span>
          ) : (
            <span className="text-xs px-2 py-1 rounded-full font-bold border bg-blue-50 text-blue-700 border-blue-100">
              Due in {new Date(opportunity.deadline).getDate() - new Date().getDate()}d
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {opportunity.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-secondary/60 border-0 text-sm px-3 py-0.5 text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="p-4 flex-1">
        <p className="text-[15px] text-gray-600 mb-3 min-h-[60px] line-clamp-3">
          {opportunity.description}
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Match score:</span>
            <span className="font-semibold text-sm">{opportunity.match}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${matchColor}`}
              style={{ width: `${opportunity.match}%` }}
            />
          </div>
        </div>
      </div>
      <div className="mt-auto border-t bg-muted/40 p-4 flex justify-between items-center">
        <div className="text-xs text-muted-foreground font-medium">
          <span className="font-semibold">Deadline:</span> {opportunity.deadline}
        </div>
        <Button
          size="sm"
          className="shadow-sm font-semibold"
          onClick={() => onViewOpportunity(opportunity.id)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
