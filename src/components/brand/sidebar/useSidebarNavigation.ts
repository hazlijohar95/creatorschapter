
import { useLocation } from "react-router-dom";
import { BarChartBig, BriefcaseBusiness, Calendar, MessageCircle, Settings, Users } from "lucide-react";
import { SidebarNavigation } from "@/types/components/sidebar";

export function useSidebarNavigation(): SidebarNavigation {
  const location = useLocation();

  const dashboardLinks = [
    {
      path: "/brand-dashboard",
      label: "Overview",
      icon: BarChartBig,
    },
    {
      path: "/brand-dashboard/campaigns",
      label: "Campaigns",
      icon: BriefcaseBusiness,
    },
    {
      path: "/brand-dashboard/calendar",
      label: "Calendar",
      icon: Calendar,
    },
  ];

  const creatorManagementLinks = [
    {
      path: "/brand-dashboard/creators",
      label: "Discovery",
      icon: Users,
    },
    {
      path: "/brand-dashboard/applications",
      label: "Applications",
      icon: BriefcaseBusiness,
    },
    {
      path: "/brand-dashboard/messages",
      label: "Messages",
      icon: MessageCircle,
    },
    {
      path: "/brand-dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/brand-dashboard" && location.pathname === "/brand-dashboard") {
      return true;
    }
    if (path !== "/brand-dashboard" && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return { dashboardLinks, creatorManagementLinks, isActive };
}
