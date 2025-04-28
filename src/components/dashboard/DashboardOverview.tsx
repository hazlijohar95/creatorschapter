
import { useNavigate } from "react-router-dom";
import { useCreatorDashboard } from "@/hooks/useCreatorDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, MessageSquare, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";

export default function DashboardOverview() {
  const navigate = useNavigate();
  const { stats, recentOpportunities, featuredPortfolio, isLoading } = useCreatorDashboard();

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading dashboard data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Opportunities</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeOpportunities || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.changeData.opportunitiesChange || "No change"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Views</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.portfolioViews || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.changeData.viewsChange || "No views yet"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.unreadMessages || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.changeData.messagesUnread || 0} unread
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeCollaborations || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.changeData.pendingReviews || 0} pending review
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Opportunities</CardTitle>
            <CardDescription>
              Latest opportunities that match your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentOpportunities && recentOpportunities.length > 0 ? (
              <div className="space-y-3">
                {recentOpportunities.map(({ id, title, brand, price, tag, tagStyle }) => (
                  <div key={id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="text-sm text-muted-foreground">{brand} • {price}</p>
                    </div>
                    <span className={`text-xs ${tagStyle} px-2 py-1 rounded-full`}>{tag}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No opportunities found</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/creator-dashboard/opportunities")}
                >
                  Browse Opportunities
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Featured Portfolio</CardTitle>
            <CardDescription>
              Your most viewed content
            </CardDescription>
          </CardHeader>
          <CardContent>
            {featuredPortfolio && featuredPortfolio.length > 0 ? (
              <div className="space-y-3">
                {featuredPortfolio.map(({ id, title, type, views }) => (
                  <div key={id} className="flex items-center gap-3 p-2 border rounded-lg">
                    <div className="bg-gray-100 w-16 h-16 rounded flex items-center justify-center">
                      <FolderOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium">{title}</p>
                      <div className="flex gap-2">
                        <span className="text-xs text-muted-foreground">{type}</span>
                        <span className="text-xs text-muted-foreground">{views} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No portfolio items yet</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/creator-dashboard/portfolio")}
                >
                  Add Portfolio Item
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
