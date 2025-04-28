
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBrandDashboardStats } from "@/hooks/useBrandDashboardStats";
import { format } from "date-fns";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { PlusCircle, TrendingUp, Users, CheckCircle2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BrandOverview() {
  const { stats, recentApplications, upcomingDeadlines, isLoading } = useBrandDashboardStats();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<PlusCircle className="w-12 h-12 text-muted-foreground" />}
          title="Welcome to your brand dashboard"
          description="Start by creating your first campaign to connect with creators"
          action={{ label: "Create Campaign", onClick: () => window.location.href = "/brand-dashboard/campaigns/new" }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm">Your campaign performance at a glance</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="bg-accentblue hover:bg-accentblue/90 flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>New Campaign</span>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-darksurface border border-softblue/20 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-gray-400">Active Campaigns</CardTitle>
              <div className="rounded-full bg-accentblue/20 p-2">
                <BarChart3 className="h-4 w-4 text-accentblue" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-success mr-1" />
              <p className="text-xs text-success">+2 from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-darksurface border border-softblue/20 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-gray-400">Creator Applications</CardTitle>
              <div className="rounded-full bg-warning/20 p-2">
                <Users className="h-4 w-4 text-warning" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.creatorApplications}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-success mr-1" />
              <p className="text-xs text-success">+5 new applications</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-darksurface border border-softblue/20 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-gray-400">Active Collaborations</CardTitle>
              <div className="rounded-full bg-chartpurple/20 p-2">
                <CheckCircle2 className="h-4 w-4 text-chartpurple" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCollaborations}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-success mr-1" />
              <p className="text-xs text-success">+1 this week</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-darksurface border border-softblue/20 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-gray-400">Content Delivered</CardTitle>
              <div className="rounded-full bg-accent/20 p-2">
                <BarChart3 className="h-4 w-4 text-accent" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contentDelivered}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-success mr-1" />
              <p className="text-xs text-success">+3 from last week</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 bg-darksurface border border-softblue/20 shadow-md">
          <CardHeader className="border-b border-softblue/10">
            <CardTitle className="text-md">Recent Applications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div>
              {recentApplications && recentApplications.length > 0 ? (
                recentApplications.map((application) => (
                  <div key={application.id} className="border-b border-softblue/10 p-4 hover:bg-muted/5">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-white">{application.creator_name}</h3>
                        <p className="text-sm text-gray-400">{application.campaign_name}</p>
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">New</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-gray-400 text-center">No recent applications</p>
                </div>
              )}
            </div>
            <div className="p-4">
              <Button variant="outline" className="w-full border-softblue/20 hover:bg-muted">
                View All Applications
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 bg-darksurface border border-softblue/20 shadow-md">
          <CardHeader className="border-b border-softblue/10">
            <CardTitle className="text-md">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div>
              {upcomingDeadlines && upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="border-b border-softblue/10 p-4 hover:bg-muted/5">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-white">{deadline.name}</h3>
                        <p className="text-sm text-gray-400">
                          {deadline.type}: {format(new Date(deadline.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full bg-warning/20 text-warning">
                        {new Date(deadline.date) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) 
                          ? 'Urgent' 
                          : 'Upcoming'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-gray-400 text-center">No upcoming deadlines</p>
                </div>
              )}
            </div>
            <div className="p-4">
              <Button variant="outline" className="w-full border-softblue/20 hover:bg-muted">
                View All Deadlines
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default BrandOverview;
