
import { useLocation, Link } from "react-router-dom";
import { Users, BarChart3, Briefcase, MessageSquare, Bell, Settings, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function BrandSidebar() {
  const location = useLocation();
  const { user } = useAuthStore();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };
  
  return (
    <Sidebar style={{
      "--sidebar-width": "16rem"
    } as React.CSSProperties} className="bg-sidebar border-r border-softblue/20">
      <SidebarHeader className="border-b border-softblue/20">
        <div className="p-4">
          <h2 className="font-space text-xl font-bold bg-gradient-to-r from-accentblue to-chartpurple bg-clip-text text-transparent">
            Brand Dashboard
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Welcome back</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-4 mb-2">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/brand-dashboard")} tooltip="Overview" 
                  className={isActive("/brand-dashboard") && location.pathname === "/brand-dashboard" ? "bg-accentblue/20 border-l-2 border-accentblue" : ""}>
                  <Link to="/brand-dashboard">
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/brand-dashboard/analytics")} tooltip="Analytics"
                  className={isActive("/brand-dashboard/analytics") ? "bg-accentblue/20 border-l-2 border-accentblue" : ""}>
                  <Link to="/brand-dashboard/analytics">
                    <BarChart3 className="w-5 h-5" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-4 mb-2 mt-6">
            Creator Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/brand-dashboard/discover")} tooltip="Discover Creators"
                  className={isActive("/brand-dashboard/discover") ? "bg-accentblue/20 border-l-2 border-accentblue" : ""}>
                  <Link to="/brand-dashboard/discover">
                    <Users className="w-5 h-5" />
                    <span>Discover Creators</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/brand-dashboard/campaigns")} tooltip="Campaigns"
                  className={isActive("/brand-dashboard/campaigns") ? "bg-accentblue/20 border-l-2 border-accentblue" : ""}>
                  <Link to="/brand-dashboard/campaigns">
                    <Briefcase className="w-5 h-5" />
                    <span>Campaigns</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/brand-dashboard/applications")} tooltip="Applications"
                  className={isActive("/brand-dashboard/applications") ? "bg-accentblue/20 border-l-2 border-accentblue" : ""}>
                  <Link to="/brand-dashboard/applications">
                    <Bell className="w-5 h-5" />
                    <span>Applications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/brand-dashboard/messages")} tooltip="Messages"
                  className={isActive("/brand-dashboard/messages") ? "bg-accentblue/20 border-l-2 border-accentblue" : ""}>
                  <Link to="/brand-dashboard/messages">
                    <MessageSquare className="w-5 h-5" />
                    <span>Messages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-4 mb-2 mt-6">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/brand-dashboard/settings")} tooltip="Settings"
                  className={isActive("/brand-dashboard/settings") ? "bg-accentblue/20 border-l-2 border-accentblue" : ""}>
                  <Link to="/brand-dashboard/settings">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-softblue/20 p-4 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accentblue/30 flex items-center justify-center text-white">
            {user?.email?.charAt(0).toUpperCase() || "B"}
          </div>
          <div className="text-sm">
            <p className="font-medium text-white/90 truncate max-w-[120px]">{user?.email}</p>
            <p className="text-xs text-gray-400">Brand Account</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
