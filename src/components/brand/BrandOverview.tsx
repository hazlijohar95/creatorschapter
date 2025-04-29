
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBrandDashboard } from "@/hooks/brand";
import { format, isValid, parseISO } from "date-fns";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { PlusCircle, Calendar, Clock, CheckCircle, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function BrandOverview() {
  const { stats, recentApplications, upcomingDeadlines, isLoading } = useBrandDashboard();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  const handleCreateCampaign = () => {
    navigate("/brand-dashboard/campaigns");
  };

  const handleViewApplications = () => {
    navigate("/brand-dashboard/applications");
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "MMM d, yyyy") : "Invalid date";
    } catch (err) {
      console.error("Date formatting error:", err);
      return "Invalid date";
    }
  };

  if (!stats) {
    return (
      <EmptyState
        icon={<PlusCircle className="w-12 h-12 text-muted-foreground" />}
        title="Welcome to your brand dashboard"
        description="Start by creating your first campaign to connect with creators"
        action={{ label: "Create Campaign", onClick: handleCreateCampaign }}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Brand Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant="default" 
            onClick={handleCreateCampaign}
            size="sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
          {recentApplications && recentApplications.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleViewApplications}
              size="sm"
            >
              View Applications
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">Current active campaigns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              Creator Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.creatorApplications}</div>
            <p className="text-xs text-muted-foreground">Pending applications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-muted-foreground" />
              Active Collaborations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCollaborations}</div>
            <p className="text-xs text-muted-foreground">Ongoing partnerships</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart className="mr-2 h-4 w-4 text-muted-foreground" />
              Content Delivered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contentDelivered}</div>
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
              {recentApplications && recentApplications.length > 0 ? (
                recentApplications.map((application) => (
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
              
              {recentApplications && recentApplications.length > 0 && (
                <Button 
                  variant="outline" 
                  className="w-full mt-2" 
                  size="sm"
                  onClick={handleViewApplications}
                >
                  View All Applications
                </Button>
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
              {upcomingDeadlines && upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((deadline) => (
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
              
              {upcomingDeadlines && upcomingDeadlines.length > 0 && (
                <Button 
                  variant="outline" 
                  className="w-full mt-2" 
                  size="sm"
                  onClick={handleCreateCampaign}
                >
                  View All Campaigns
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default BrandOverview;
