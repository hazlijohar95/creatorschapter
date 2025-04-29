
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentApplication } from "@/hooks/brand/useRecentApplications";
import { formatDate } from "./utils/dateUtils";

interface RecentApplicationsCardProps {
  applications: RecentApplication[];
  onViewAll: () => void;
}

export function RecentApplicationsCard({ applications, onViewAll }: RecentApplicationsCardProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications && applications.length > 0 ? (
            applications.map((application) => (
              <div key={application.id} className="border-b pb-2">
                <h3 className="font-medium">{application.creator_name}</h3>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">{application.campaign_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {application.created_at ? formatDate(application.created_at) : ""}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No recent applications</p>
          )}
          
          {applications && applications.length > 0 && (
            <Button 
              variant="outline" 
              className="w-full mt-2" 
              size="sm"
              onClick={onViewAll}
            >
              View All Applications
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
