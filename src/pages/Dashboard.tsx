import { useAuthStore } from "@/lib/auth";
import { Navigate } from "react-router-dom";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { step2Complete, loading, hasCreatorProfile } = useProfileCompletion();
  const [role, setRole] = useState<string | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (user?.id) {
        try {
          setIsCheckingRole(true);
          const { data: p, error } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
          
          if (error) {
            console.error("Error fetching role:", error);
            return;
          }
          
          setRole(p?.role ?? null);
        } catch (err) {
          console.error("Exception fetching role:", err);
        } finally {
          setIsCheckingRole(false);
        }
      } else {
        setIsCheckingRole(false);
      }
    };
    
    if (user) fetchRole();
    else setIsCheckingRole(false);
  }, [user]);

  if (!user) return <Navigate to="/auth" replace />;
  if (loading || isCheckingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary mr-2" />
        <span className="ml-2 text-lg">Loading your dashboard...</span>
      </div>
    );
  }

  if (role === "brand") return <Navigate to="/brand-dashboard" replace />;
  if (role === "creator") {
    if (!step2Complete) return <Navigate to="/onboarding" replace />;
    return <Navigate to="/creator-dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to Creator Chapter</h1>
        <p className="mb-4">Please complete your profile setup to continue.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
