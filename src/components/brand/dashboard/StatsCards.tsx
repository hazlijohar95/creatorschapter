
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Calendar, CheckCircle, Clock } from "lucide-react";
import { BrandDashboardStats } from "@/hooks/brand/useBrandStats";

interface StatsCardsProps {
  stats: BrandDashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
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
  );
}
