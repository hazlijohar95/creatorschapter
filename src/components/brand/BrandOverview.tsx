
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBrandDashboard } from "@/hooks/useBrandDashboard";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export function BrandOverview() {
  const { stats, recentApplications, upcomingDeadlines, isLoading } = useBrandDashboard();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Brand Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeCampaigns ?? 0}</div>
            <p className="text-xs text-muted-foreground">Current active campaigns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Creator Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.creatorApplications ?? 0}</div>
            <p className="text-xs text-muted-foreground">Pending applications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Collaborations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeCollaborations ?? 0}</div>
            <p className="text-xs text-muted-foreground">Ongoing partnerships</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.contentDelivered ?? 0}</div>
            <p className="text-xs text-muted-foreground">Pieces of content received</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications?.map((application) => (
                <div key={application.id} className="border-b pb-2">
                  <h3 className="font-medium">{application.creator_name}</h3>
                  <p className="text-sm text-muted-foreground">{application.campaign_name}</p>
                </div>
              ))}
              {(!recentApplications || recentApplications.length === 0) && (
                <p className="text-sm text-muted-foreground">No recent applications</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines?.map((deadline) => (
                <div key={deadline.id} className="border-b pb-2">
                  <h3 className="font-medium">{deadline.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {deadline.type}: {format(new Date(deadline.date), 'MMM d, yyyy')}
                  </p>
                </div>
              ))}
              {(!upcomingDeadlines || upcomingDeadlines.length === 0) && (
                <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default BrandOverview;
