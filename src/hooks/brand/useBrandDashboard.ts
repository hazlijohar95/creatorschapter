
import { useBrandStats } from "./useBrandStats";
import { useRecentApplications } from "./useRecentApplications";
import { useUpcomingDeadlines } from "./useUpcomingDeadlines";

export function useBrandDashboard() {
  const { data: stats, isLoading: statsLoading } = useBrandStats();
  const { data: recentApplications, isLoading: applicationsLoading } = useRecentApplications();
  const { data: upcomingDeadlines, isLoading: deadlinesLoading } = useUpcomingDeadlines();

  return {
    stats,
    recentApplications,
    upcomingDeadlines,
    isLoading: statsLoading || applicationsLoading || deadlinesLoading
  };
}
