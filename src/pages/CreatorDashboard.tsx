
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { 
  SidebarProvider,
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Search, 
  FolderOpen, 
  MessageSquare, 
  Users, 
  Settings,
  Globe
} from "lucide-react";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import OpportunityDiscovery from "@/components/dashboard/OpportunityDiscovery";
import PortfolioManagement from "@/components/dashboard/PortfolioManagement";
import CollaborationManagement from "@/components/dashboard/CollaborationManagement";
import SocialMediaProfile from "@/components/dashboard/SocialMediaProfile";
import SettingsPanel from "@/components/dashboard/SettingsPanel";

export default function CreatorDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { step2Complete, loading } = useProfileCompletion();
  const [activeTab, setActiveTab] = useState<string>("overview");

  if (loading) return <div className="p-6">Loading...</div>;
  if (!step2Complete) return navigate("/onboarding");
  
  const renderContent = () => {
    switch(activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "opportunities":
        return <OpportunityDiscovery />;
      case "portfolio":
        return <PortfolioManagement />;
      case "collaborations":
        return <CollaborationManagement />;
      case "social":
        return <SocialMediaProfile />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="p-2">
              <h2 className="text-lg font-bold">Creator Chapter</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "overview"}
                      onClick={() => setActiveTab("overview")}
                      tooltip="Overview"
                    >
                      <LayoutDashboard />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "opportunities"}
                      onClick={() => setActiveTab("opportunities")}
                      tooltip="Discover Opportunities"
                    >
                      <Search />
                      <span>Opportunities</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "portfolio"}
                      onClick={() => setActiveTab("portfolio")}
                      tooltip="Portfolio Management"
                    >
                      <FolderOpen />
                      <span>Portfolio</span>
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
                    <SidebarMenuButton 
                      isActive={activeTab === "collaborations"}
                      onClick={() => setActiveTab("collaborations")}
                      tooltip="Manage Collaborations"
                    >
                      <Users />
                      <span>Collaborations</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "social"}
                      onClick={() => setActiveTab("social")}
                      tooltip="Social Media Profile"
                    >
                      <Globe />
                      <span>Platform & Reach</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === "settings"}
                      onClick={() => setActiveTab("settings")}
                      tooltip="Settings"
                    >
                      <Settings />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-2xl font-bold">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
          {renderContent()}
        </div>
      </div>
    </SidebarProvider>
  );
}
