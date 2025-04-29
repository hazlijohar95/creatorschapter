
import { useAuthStore } from "@/lib/auth";
import { Navigate } from "react-router-dom";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { step2Complete, loading } = useProfileCompletion();
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (user?.id) {
        const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
        setRole(p?.role ?? null);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    if (user) fetchRole();
    else setIsLoading(false);
  }, [user]);

  if (!user) return <Navigate to="/auth" replace />;
  
  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-16 my-8">
        <Loader className="h-5 w-5 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Redirecting to dashboard...</span>
      </div>
    );
  }

  if (role === "brand") return <Navigate to="/brand-dashboard" replace />;
  if (!step2Complete && role === "creator") return <Navigate to="/onboarding" replace />;

  // Default: creator & finished
  return <Navigate to="/creator-dashboard" replace />;
}
