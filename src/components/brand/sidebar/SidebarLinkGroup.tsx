
import { SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarGroup } from "@/components/ui/sidebar";
import { ReactNode } from "react";

interface SidebarLinkGroupProps {
  label: string;
  children: ReactNode;
}

export function SidebarLinkGroup({ label, children }: SidebarLinkGroupProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {children}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
