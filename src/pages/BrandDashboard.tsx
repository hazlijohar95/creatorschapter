
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { BrandSidebar } from "@/components/brand/BrandSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Mail, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";

export default function BrandDashboard() {
  const { user } = useAuthStore();
  const { loading } = useProfileCompletion();

  useEffect(() => {
    document.title = "Brand Dashboard | Creator Chapter";
  }, []);

  if (!user) return <Navigate to="/auth" replace />;
  if (loading) return <div className="p-6 flex items-center justify-center min-h-screen"><div className="animate-pulse text-accent">Loading...</div></div>;

  const handleNotificationClick = () => {
    toast("Notifications", {
      description: "You have 3 unread notifications"
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-darkbg text-white">
        <BrandSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b border-softblue/20 bg-darksurface shadow-sm">
            <div className="flex items-center justify-between h-full px-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-gray-400 hover:text-white">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
                <div className="w-72 max-w-sm hidden md:block">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search..." 
                      className="pl-9 bg-muted border-none focus-visible:ring-1 focus-visible:ring-accent/50"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={handleNotificationClick}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-error text-[10px] font-medium flex items-center justify-center">3</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={() => toast("Messages", {
                    description: "You have 2 unread messages"
                  })}
                >
                  <Mail className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-medium flex items-center justify-center">2</span>
                </Button>
                
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 bg-accentblue/20">
                    <div className="flex items-center justify-center h-full w-full text-sm font-medium">
                      {user?.email?.charAt(0).toUpperCase() || "B"}
                    </div>
                  </Avatar>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-darkbg">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
