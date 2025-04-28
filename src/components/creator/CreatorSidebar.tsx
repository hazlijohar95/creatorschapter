
import { SidebarMenu, SidebarMenuItem, Sidebar, SidebarHeader, SidebarContent, SidebarMenuAction, SidebarFooter, SidebarMenuSub, SidebarMenuSubItem, SidebarInset, SidebarMenuButton } from "../ui/sidebar";
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
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname === "/creator-dashboard"}
              onClick={() => navigate("/creator-dashboard")}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname.includes("/creator-dashboard/opportunities")}
              onClick={() => navigate("/creator-dashboard/opportunities")}
              onMouseEnter={prefetchOpportunities}
            >
              <Search className="h-5 w-5" />
              <span>Opportunities</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname.includes("/creator-dashboard/portfolio")}
              onClick={() => navigate("/creator-dashboard/portfolio")}
            >
              <LayoutGrid className="h-5 w-5" />
              <span>Portfolio</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname.includes("/creator-dashboard/collaborations")}
              onClick={() => navigate("/creator-dashboard/collaborations")}
            >
              <Users className="h-5 w-5" />
              <span>Collaborations</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname.includes("/creator-dashboard/social")}
              onClick={() => navigate("/creator-dashboard/social")}
            >
              <Sliders className="h-5 w-5" />
              <span>Social Media</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={location.pathname.includes("/creator-dashboard/settings")}
              onClick={() => navigate("/creator-dashboard/settings")}
              onMouseEnter={prefetchProfile}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuAction onClick={handleSignOut}>
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </SidebarMenuAction>
      </SidebarFooter>
    </Sidebar>
  );
}
