
import { useAuthStore } from "@/lib/auth";
import { Navigate } from "react-router-dom";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { step2Complete, loading } = useProfileCompletion();

  if (!user) return <Navigate to="/auth" replace />;
  if (loading) return <div className="p-6">Loading...</div>;
  if (!step2Complete) return <Navigate to="/onboarding" replace />;

  // Redirect to the creator dashboard instead
  return <Navigate to="/creator-dashboard" replace />;
}
