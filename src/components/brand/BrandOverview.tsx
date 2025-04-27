import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { CardSkeleton } from "@/components/shared/CardSkeleton";
import { ErrorFallback } from "@/components/shared/ErrorFallback";
import { BrandMetrics, Campaign, CampaignCreator } from "@/types/brandDashboard";
import { useEffect, useState } from "react";

interface CampaignResponse {
  status: string;
}

interface ApplicationResponse {
  status: string;
}

export function BrandOverview() {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState<BrandMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const campaignsQuery = supabase.from('campaigns').select('status');
        const { data: campaignsData, error: campaignsError } = await campaignsQuery;
        if (campaignsError) throw campaignsError;

        const applicationsQuery = supabase.from('campaign_creators').select('status').eq('brand_id', user.id);
        const { data: applicationsData, error: applicationsError } = await applicationsQuery;
        if (applicationsError) throw applicationsError;

        const campaigns = (campaignsData || []) as CampaignResponse[];
        const applications = (applicationsData || []) as ApplicationResponse[];

        const calculatedMetrics: BrandMetrics = {
          activeCampaigns: campaigns.filter(c => c.status === 'active').length,
          totalApplications: applications.length,
          activeCollaborations: applications.filter(a => a.status === 'active').length,
          deliveredContent: applications.filter(a => a.status === 'completed').length
        };
        
        setMetrics(calculatedMetrics);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Brand Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} headerHeight={4} rows={2} />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <CardSkeleton rows={4} />
          <CardSkeleton rows={4} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Brand Dashboard</h1>
        <ErrorFallback 
          error={error as Error} 
          message="Failed to load dashboard data" 
        />
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
            <div className="text-2xl font-bold">{metrics?.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Creator Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalApplications}</div>
            <p className="text-xs text-muted-foreground">+5 new this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Collaborations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeCollaborations}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.deliveredContent}</div>
            <p className="text-xs text-muted-foreground">+8 from last month</p>
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
              <div className="border-b pb-2">
                <h3 className="font-medium">Alex Johnson</h3>
                <p className="text-sm text-muted-foreground">Summer Collection Campaign</p>
              </div>
              <div className="border-b pb-2">
                <h3 className="font-medium">Jamie Smith</h3>
                <p className="text-sm text-muted-foreground">Product Launch Event</p>
              </div>
              <div>
                <h3 className="font-medium">Sam Rodriguez</h3>
                <p className="text-sm text-muted-foreground">Brand Ambassador Program</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-medium">Summer Collection</h3>
                <p className="text-sm text-muted-foreground">Content Due: June 15</p>
              </div>
              <div className="border-b pb-2">
                <h3 className="font-medium">Product Launch</h3>
                <p className="text-sm text-muted-foreground">Campaign Start: July 1</p>
              </div>
              <div>
                <h3 className="font-medium">Fall Lineup</h3>
                <p className="text-sm text-muted-foreground">Planning Due: July 10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
