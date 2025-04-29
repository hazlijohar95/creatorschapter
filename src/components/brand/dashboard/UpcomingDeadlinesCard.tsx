
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Deadline } from "@/hooks/brand/useUpcomingDeadlines";
import { formatDate } from "./utils/dateUtils";

interface UpcomingDeadlinesCardProps {
  deadlines: Deadline[];
  onViewAll: () => void;
}

export function UpcomingDeadlinesCard({ deadlines, onViewAll }: UpcomingDeadlinesCardProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deadlines && deadlines.length > 0 ? (
            deadlines.map((deadline) => (
              <div key={deadline.id} className="border-b pb-2">
                <h3 className="font-medium">{deadline.name}</h3>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    {deadline.type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {deadline.date ? formatDate(deadline.date) : ""}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No upcoming deadlines</p>
          )}
          
          {deadlines && deadlines.length > 0 && (
            <Button 
              variant="outline" 
              className="w-full mt-2" 
              size="sm"
              onClick={onViewAll}
            >
              View All Campaigns
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
