
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";

/**
 * Sidebar component types
 */

export interface SidebarLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

export interface SidebarLinkGroupProps {
  label: string;
  children: ReactNode;
}

export interface SidebarFooterProps {
  user: User | null;
}

export interface SidebarNavigationLink {
  path: string;
  label: string;
  icon: LucideIcon;
}

export interface SidebarNavigation {
  dashboardLinks: SidebarNavigationLink[];
  creatorManagementLinks: SidebarNavigationLink[];
  isActive: (path: string) => boolean;
}
