import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/auth";
import {
  FileText,
  Grid3X3,
  Home,
  Image,
  Inbox,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Settings,
  Star,
  UserIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";

export function CreatorSidebar() {
  const { user, signout } = useAuthStore();
  const location = useLocation();

  return (
    <>
      <SidebarRail>
        <div className="flex h-14 items-center px-4">
          <Link to="/">
            <span className="text-xl font-semibold">CC</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <SidebarTrigger asChild>
            <UserIcon />
          </SidebarTrigger>
        </div>
      </SidebarRail>
      <SidebarContent className="w-[240px] lg:w-[280px]">
        <SidebarHeader className="flex h-14 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2">
            <h3 className="font-semibold">Creator Chapter</h3>
          </Link>
        </SidebarHeader>
        <div className="flex-1 overflow-auto py-6">
          <div className="px-6">
            <div className="mb-4 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>CR</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center gap-1">
                  <div className="truncate font-medium">
                    {user?.user_metadata?.full_name || "Creator"}
                  </div>
                  <Badge
                    variant="secondary"
                    className="ml-auto flex h-6 w-6 items-center justify-center rounded-md p-0 text-xs font-medium"
                  >
                    C
                  </Badge>
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </div>
              </div>
            </div>
            <SidebarMenu>
              {[
                { icon: Home, label: "Dashboard", path: "/creator-dashboard" },
                { icon: Lightbulb, label: "Opportunities", path: "/creator-dashboard/opportunities" },
                { icon: FileText, label: "Applications", path: "/creator-dashboard/applications" },
                { icon: Star, label: "Collaborations", path: "/creator-dashboard/collaborations" },
                { icon: Grid3X3, label: "Portfolio", path: "/creator-dashboard/portfolio" },
                { icon: Image, label: "Social Media", path: "/creator-dashboard/social" },
                { icon: Settings, label: "Settings", path: "/creator-dashboard/settings" }
              ].map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link
                    to={item.path}
                    className={
                      location.pathname === item.path
                        ? "bg-accent text-accent-foreground flex items-center gap-2 p-2 rounded"
                        : "flex items-center gap-2 p-2"
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.label === "Applications" && <SidebarMenuBadge>New</SidebarMenuBadge>}
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </div>
        <SidebarFooter className="border-t p-6">
          <button
            className="flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-muted"
            onClick={() => signout()}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs">Log out</span>
          </button>
        </SidebarFooter>
      </SidebarContent>
    </>
  );
}
