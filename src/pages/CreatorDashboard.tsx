
import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/auth";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { useSessionRecovery } from "@/hooks/useSessionRecovery";
import { CreatorSidebar } from "@/components/creator/CreatorSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Loader, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function CreatorDashboard(): JSX.Element {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { step2Complete, loading: profileLoading, error: profileError } = useProfileCompletion();
  const { isRecovering } = useSessionRecovery();
  const { toast } = useToast();
  const [verifyingProfile, setVerifyingProfile] = useState(true);
  const [hasCreatorProfile, setHasCreatorProfile] = useState<boolean | null>(null);
  
  // Combine loading states
  const isLoading = isRecovering || profileLoading || verifyingProfile;
  
  // First verify that the user actually has a creator_profile
  useEffect(() => {
    if (!user) return;
    
    const verifyCreatorProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("creator_profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error checking creator profile:", error);
          toast({
            title: "Error",
            description: "Could not verify your creator profile",
            variant: "destructive"
          });
          setHasCreatorProfile(false);
        } else {
          setHasCreatorProfile(!!data);
        }
      } catch (err) {
        console.error("Exception checking creator profile:", err);
        setHasCreatorProfile(false);
      } finally {
        setVerifyingProfile(false);
      }
    };
    
    verifyCreatorProfile();
  }, [user, toast]);
  
  // Redirect logic based on profile checks
  useEffect(() => {
    // Only proceed if we have finished all loading states
    if (isLoading) return;
    
    // If no user or missing creator profile, redirect to appropriate page
    if (!user) {
      navigate("/auth");
      return;
    }
    
    // If profile verification is complete and user doesn't have a creator profile
    if (hasCreatorProfile === false) {
      navigate("/dashboard");
      return;
    }
    
    // If profile is loaded and not complete, redirect to onboarding
    if (!isLoading && !step2Complete && user) {
      navigate("/onboarding");
    }
  }, [isLoading, step2Complete, user, navigate, hasCreatorProfile]);

  // Debug logging
  useEffect(() => {
    console.log({
      isRecovering,
      profileLoading,
      verifyingProfile,
      hasCreatorProfile,
      step2Complete,
      isLoading
    });
  }, [isRecovering, profileLoading, verifyingProfile, hasCreatorProfile, step2Complete, isLoading]);

  // Error handling
  if (profileError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-xl font-semibold mb-2">Error Loading Dashboard</h1>
        <p className="text-muted-foreground mb-4">{profileError.message || "Something went wrong"}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary mr-2" />
        <span className="ml-2 text-lg">Loading your dashboard...</span>
      </div>
    );
  }
  
  // Auth check
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">Authentication Required</p>
          <button 
            onClick={() => navigate("/auth")} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Display dashboard
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <CreatorSidebar />
        <main className="flex-1 py-0 px-0 mx-[50px] my-[30px]">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
