
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { BrandSidebar } from "@/components/brand/BrandSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

export default function BrandDashboard() {
  const { user } = useAuthStore();
  const { loading } = useProfileCompletion();

  useEffect(() => {
    document.title = "Brand Dashboard | Creator Chapter";
  }, []);

  if (!user) return <Navigate to="/auth" replace />;
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <BrandSidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
