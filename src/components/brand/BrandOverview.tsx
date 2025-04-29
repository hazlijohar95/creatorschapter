
import { useBrandDashboard } from "@/hooks/brand";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { StatsCards } from "./dashboard/StatsCards";
import { RecentApplicationsCard } from "./dashboard/RecentApplicationsCard";
import { UpcomingDeadlinesCard } from "./dashboard/UpcomingDeadlinesCard";

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
      <DashboardHeader 
        onCreateCampaign={handleCreateCampaign}
        onViewApplications={handleViewApplications}
        showApplicationsButton={recentApplications && recentApplications.length > 0}
      />
      
      <StatsCards stats={stats} />
      
      <div className="grid gap-4 md:grid-cols-2">
        <RecentApplicationsCard 
          applications={recentApplications || []} 
          onViewAll={handleViewApplications} 
        />
        
        <UpcomingDeadlinesCard 
          deadlines={upcomingDeadlines || []} 
          onViewAll={handleCreateCampaign} 
        />
      </div>
    </div>
  );
}

export default BrandOverview;
