
import { useAuthStore } from "@/lib/auth";
import { Sidebar } from "@/components/ui/sidebar";
import { 
  SidebarHeader, 
  SidebarFooter,
  SidebarLink, 
  SidebarLinkGroup,
  useSidebarNavigation 
} from "./sidebar";

export function BrandSidebar() {
  const { user } = useAuthStore();
  const { dashboardLinks, creatorManagementLinks, isActive } = useSidebarNavigation();
  
  return (
    <Sidebar style={{
      "--sidebar-width": "16rem"
    } as React.CSSProperties} className="border-r">
      <SidebarHeader />
      
      <SidebarLinkGroup label="Dashboard">
        {dashboardLinks.map((item) => (
          <SidebarLink
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.path)}
          />
        ))}
      </SidebarLinkGroup>
      
      <SidebarLinkGroup label="Creator Management">
        {creatorManagementLinks.map((item) => (
          <SidebarLink
            key={item.path}
            to={item.path}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.path)}
          />
        ))}
      </SidebarLinkGroup>
      
      <SidebarFooter user={user} />
    </Sidebar>
  );
}
