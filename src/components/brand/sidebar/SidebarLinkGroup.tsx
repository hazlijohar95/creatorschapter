
import { SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarGroup } from "@/components/ui/sidebar";
import { SidebarLinkGroupProps } from "@/types/components/sidebar";

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
