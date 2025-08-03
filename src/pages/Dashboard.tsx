
import { useAuthStore } from "@/lib/auth";
import { Navigate } from "react-router-dom";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { useEffect } from "react";
import { ProfileSkeleton } from "@/components/shared/QuickSkeleton";
import { logger } from "@/lib/logger";

export default function Dashboard() {
  const { 
    user, 
    profile, 
    isLoading: authLoading, 
    isAuthenticated,
    refreshProfile 
  } = useAuthStore();
  const { step2Complete, loading: profileLoading } = useProfileCompletion();

  // Ensure profile is loaded
  useEffect(() => {
    if (user && !profile) {
      refreshProfile();
    }
  }, [user, profile, refreshProfile]);

  // Show skeleton while auth or profile data is loading
  if (authLoading || profileLoading || (user && !profile)) {
    return <ProfileSkeleton />;
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  // Ensure we have profile data
  if (!profile) {
    logger.error('Profile data missing for authenticated user', { userId: user.id });
    return <Navigate to="/auth" replace />;
  }

  // Role-based redirection with security logging
  if (profile.role === "brand") {
    logger.info('Brand user accessing dashboard', { userId: user.id });
    return <Navigate to="/brand-dashboard" replace />;
  }

  if (profile.role === "creator") {
    if (!step2Complete) {
      logger.info('Creator user needs onboarding', { userId: user.id });
      return <Navigate to="/onboarding" replace />;
    }
    
    logger.info('Creator user accessing dashboard', { userId: user.id });
    return <Navigate to="/creator-dashboard" replace />;
  }

  // Fallback for unknown roles
  logger.warn('User with unknown role accessing dashboard', { 
    userId: user.id, 
    role: profile.role 
  });
  return <Navigate to="/auth" replace />;
}
