
import { useEffect } from "react";
import { useNavigate, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { CreatorSidebar } from "@/components/creator/CreatorSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import { PageTransition } from "@/components/shared/PageTransition";
import { DashboardSkeleton } from "@/components/shared/QuickSkeleton";

export default function CreatorDashboard(): JSX.Element {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { step2Complete, loading } = useProfileCompletion();

  useEffect(() => {
    if (!loading && !step2Complete && user) {
      navigate("/onboarding");
    }
  }, [loading, step2Complete, user, navigate]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <CreatorSidebar />
        <main className="flex-1 py-0 px-0 mx-[50px] my-[30px] relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -z-10 animate-pulse" />
          <div className="absolute bottom-40 left-20 w-72 h-72 bg-neon/5 rounded-full filter blur-3xl -z-10" />
          
          {/* Main content with page transition */}
          <div className="relative z-0 h-full">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
