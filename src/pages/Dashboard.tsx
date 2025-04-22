
import { useAuthStore } from "@/lib/auth";
import { Navigate } from "react-router-dom";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { step2Complete, loading } = useProfileCompletion();

  if (!user) return <Navigate to="/auth" replace />;
  if (loading) return <div className="p-6">Loading...</div>;
  if (!step2Complete) return <Navigate to="/onboarding" replace />;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white/90 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard!</h1>
      <p>This is your main workspace. You'll soon see widgets for opportunities, trends, and more.</p>
    </div>
  );
}
