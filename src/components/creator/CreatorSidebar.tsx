import { useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Search, FolderOpen, MessageSquare, Users, Settings, Globe } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
export function CreatorSidebar() {
  const location = useLocation();
  const {
    user
  } = useAuthStore();
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return <Sidebar style={{
    "--sidebar-width": "16rem"
  } as React.CSSProperties} className="border-r">
      <SidebarHeader className="border-b">
        <div className="p-4">
          <h2 className="font-space text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-gray-50">
            Creator Dashboard
          </h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/creator-dashboard")} tooltip="Overview">
                  <Link to="/creator-dashboard">
                    <LayoutDashboard />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/creator-dashboard/opportunities")} tooltip="Discover Opportunities">
                  <Link to="/creator-dashboard/opportunities">
                    <Search />
                    <span>Opportunities</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/creator-dashboard/portfolio")} tooltip="Portfolio Management">
                  <Link to="/creator-dashboard/portfolio">
                    <FolderOpen />
                    <span>Portfolio</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Connect</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/creator-dashboard/collaborations")} tooltip="Manage Collaborations">
                  <Link to="/creator-dashboard/collaborations">
                    <Users />
                    <span>Collaborations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/creator-dashboard/social")} tooltip="Social Media Profile">
                  <Link to="/creator-dashboard/social">
                    <Globe />
                    <span>Platform & Reach</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/creator-dashboard/settings")} tooltip="Settings">
                  <Link to="/creator-dashboard/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <p className="font-medium">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Creator Account</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>;
}