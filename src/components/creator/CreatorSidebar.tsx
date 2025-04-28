
import { SidebarMenu, SidebarMenuItem, Sidebar, SidebarHeader, SidebarContent, SidebarMenuAction, SidebarFooter, SidebarMenuSub, SidebarMenuSubItem, SidebarInset } from "../ui/sidebar";
import { Home, Search, LayoutGrid, Users, Sliders, Settings, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { usePrefetch } from "@/hooks/usePrefetch";

export function CreatorSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { prefetchOpportunities, prefetchProfile } = usePrefetch();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-xl font-bold">Creator Chapter</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem
            active={location.pathname === "/creator-dashboard"}
            icon={<Home className="h-5 w-5" />}
            onClick={() => navigate("/creator-dashboard")}
          >
            Dashboard
          </SidebarMenuItem>
          
          <SidebarMenuItem
            active={location.pathname.includes("/creator-dashboard/opportunities")}
            icon={<Search className="h-5 w-5" />}
            onClick={() => navigate("/creator-dashboard/opportunities")}
            onMouseEnter={prefetchOpportunities}
          >
            Opportunities
          </SidebarMenuItem>
          
          <SidebarMenuItem
            active={location.pathname.includes("/creator-dashboard/portfolio")}
            icon={<LayoutGrid className="h-5 w-5" />}
            onClick={() => navigate("/creator-dashboard/portfolio")}
          >
            Portfolio
          </SidebarMenuItem>
          
          <SidebarMenuItem
            active={location.pathname.includes("/creator-dashboard/collaborations")}
            icon={<Users className="h-5 w-5" />}
            onClick={() => navigate("/creator-dashboard/collaborations")}
          >
            Collaborations
          </SidebarMenuItem>
          
          <SidebarMenuItem
            active={location.pathname.includes("/creator-dashboard/social")}
            icon={<Sliders className="h-5 w-5" />}
            onClick={() => navigate("/creator-dashboard/social")}
          >
            Social Media
          </SidebarMenuItem>
          
          <SidebarMenuItem
            active={location.pathname.includes("/creator-dashboard/settings")}
            icon={<Settings className="h-5 w-5" />}
            onClick={() => navigate("/creator-dashboard/settings")}
            onMouseEnter={prefetchProfile}
          >
            Settings
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuAction icon={<LogOut className="h-5 w-5" />} onClick={handleSignOut}>
          Sign Out
        </SidebarMenuAction>
      </SidebarFooter>
    </Sidebar>
  );
}
