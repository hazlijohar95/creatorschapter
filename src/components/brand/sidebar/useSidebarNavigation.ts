
import { useLocation } from "react-router-dom";
import { Users, Briefcase, MessageSquare, Bell, Settings } from "lucide-react";

export interface NavItem {
  path: string;
  label: string;
  icon: any;
}

export function useSidebarNavigation() {
  const location = useLocation();

  const dashboardLinks: NavItem[] = [
    {
      path: "/brand-dashboard",
      label: "Overview",
      icon: Briefcase,
    },
  ];

  const creatorManagementLinks: NavItem[] = [
    {
      path: "/brand-dashboard/discover",
      label: "Discover Creators",
      icon: Users,
    },
    {
      path: "/brand-dashboard/campaigns",
      label: "Campaigns",
      icon: Briefcase,
    },
    {
      path: "/brand-dashboard/applications",
      label: "Applications",
      icon: Bell,
    },
    {
      path: "/brand-dashboard/messages",
      label: "Messages",
      icon: MessageSquare,
    },
    {
      path: "/brand-dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return {
    dashboardLinks,
    creatorManagementLinks,
    isActive,
  };
}
