
import { useLocation, Link } from "react-router-dom";
import { Users, Briefcase, MessageSquare, Bell, Settings } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function BrandSidebar() {
  const location = useLocation();
  const { user } = useAuthStore();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <Sidebar style={{
      "--sidebar-width": "16rem"
    } as React.CSSProperties} className="border-r">
      <SidebarHeader className="border-b">
        <div className="p-4">
          <h2 className="font-space text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-gray-50">
            Brand Dashboard
          </h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/brand-dashboard")} tooltip="Overview">
                  <Link to="/brand-dashboard">
                    <Briefcase />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Creator Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/brand-dashboard/discover")} tooltip="Discover Creators">
                  <Link to="/brand-dashboard/discover">
                    <Users />
                    <span>Discover Creators</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/brand-dashboard/campaigns")} tooltip="Campaigns">
                  <Link to="/brand-dashboard/campaigns">
                    <Briefcase />
                    <span>Campaigns</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/brand-dashboard/applications")} tooltip="Applications">
                  <Link to="/brand-dashboard/applications">
                    <Bell />
                    <span>Applications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/brand-dashboard/messages")} tooltip="Messages">
                  <Link to="/brand-dashboard/messages">
                    <MessageSquare />
                    <span>Messages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/brand-dashboard/settings")} tooltip="Settings">
                  <Link to="/brand-dashboard/settings">
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
            <p className="text-xs text-muted-foreground">Brand Account</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
