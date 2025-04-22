import { useAuthStore } from "@/lib/auth";
import { Navigate } from "react-router-dom";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { step2Complete, loading } = useProfileCompletion();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (user?.id) {
        const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
        setRole(p?.role ?? null);
      }
    };
    if (user) fetchRole();
  }, [user]);

  if (!user) return <Navigate to="/auth" replace />;
  if (loading || !role) return <div className="p-6">Loading...</div>;

  if (role === "brand") return <Navigate to="/brand-dashboard" replace />;
  if (!step2Complete && role === "creator") return <Navigate to="/onboarding" replace />;

  // Default: creator & finished
  return <Navigate to="/creator-dashboard" replace />;
}
