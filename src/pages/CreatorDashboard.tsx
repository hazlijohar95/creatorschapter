
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { CreatorSidebar } from "@/components/creator/CreatorSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Loader } from "lucide-react";
import { Toaster } from "sonner";

export default function CreatorDashboard(): JSX.Element {
  const {
    user
  } = useAuthStore();
  const navigate = useNavigate();
  const {
    step2Complete,
    loading
  } = useProfileCompletion();

  useEffect(() => {
    if (!loading && !step2Complete && user) {
      navigate("/onboarding");
    }
  }, [loading, step2Complete, user, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">Authentication Required</p>
          <button onClick={() => navigate("/auth")} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Sign In
          </button>
        </div>
      </div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <CreatorSidebar />
        <main className="flex-1 py-0 px-0 mx-[50px] my-[30px] relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -z-10 animate-pulse" />
          <div className="absolute bottom-40 left-20 w-72 h-72 bg-neon/5 rounded-full filter blur-3xl -z-10" />
          
          {/* Main content */}
          <div className="relative z-0">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
}
