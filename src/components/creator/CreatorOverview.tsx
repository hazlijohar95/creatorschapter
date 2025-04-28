
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, MessageSquare, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreatorDashboard } from "@/hooks/useCreatorDashboard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

export function CreatorOverview() {
  const { stats, recentOpportunities, featuredPortfolio, isLoading } = useCreatorDashboard();

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  if (!stats) {
    return (
      <EmptyState
        icon={<Search className="w-12 h-12 text-muted-foreground" />}
        title="No dashboard data available"
        description="We couldn't retrieve your dashboard data. Please try again later or contact support."
        action={{ label: "Refresh", onClick: () => window.location.reload() }}
      />
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-muted-foreground">Dashboard Overview</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { 
            icon: Search, 
            title: "Active Opportunities", 
            value: stats.activeOpportunities.toString(), 
            change: stats.changeData.opportunitiesChange,
            className: "text-blue-500" 
          },
          { 
            icon: FolderOpen, 
            title: "Portfolio Views", 
            value: stats.portfolioViews.toString(), 
            change: stats.changeData.viewsChange,
            className: "text-green-500" 
          },
          { 
            icon: MessageSquare, 
            title: "Messages", 
            value: stats.unreadMessages.toString(), 
            change: `${stats.changeData.messagesUnread} unread`,
            className: "text-purple-500" 
          },
          { 
            icon: Users, 
            title: "Collaborations", 
            value: stats.activeCollaborations.toString(), 
            change: `${stats.changeData.pendingReviews} pending review`,
            className: "text-orange-500" 
          }
        ].map(({ icon: Icon, title, value, change, className }) => (
          <Card key={title} className="hover:shadow-sm transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <Icon className={cn("h-4 w-4", className)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-light text-foreground">{value}</div>
              <p className="text-xs text-muted-foreground">{change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">Recent Opportunities</CardTitle>
            <CardDescription>Latest opportunities that match your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOpportunities && recentOpportunities.length > 0 ? (
                recentOpportunities.map(({ id, title, brand, price, tag, tagStyle }) => (
                  <div 
                    key={id} 
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{title}</p>
                      <p className="text-xs text-muted-foreground">{brand} • {price}</p>
                    </div>
                    <span className={`text-xs ${tagStyle} px-2 py-1 rounded-full`}>{tag}</span>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-muted-foreground">No opportunities available yet</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">Featured Portfolio</CardTitle>
            <CardDescription>Your most viewed content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featuredPortfolio && featuredPortfolio.length > 0 ? (
                featuredPortfolio.map(({ id, title, type, views }) => (
                  <div 
                    key={id} 
                    className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="bg-accent/30 w-16 h-16 rounded flex items-center justify-center">
                      <FolderOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{title}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>{type}</span>
                        <span>•</span>
                        <span>{views} views</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <FolderOpen className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No portfolio items yet</p>
                  <a href="/creator-dashboard/portfolio" className="text-sm text-primary block mt-2">Add your first item</a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CreatorOverview;
