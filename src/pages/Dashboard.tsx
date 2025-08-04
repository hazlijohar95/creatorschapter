
import { useAuthStore } from "@/lib/auth";
import { Navigate } from "react-router-dom";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { useAuthFlow } from "@/hooks/useAuthFlow";
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
  const { authFlowType, isNewUser, isExistingUser } = useAuthFlow();

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
    // Different logic for new vs existing users
    if (isNewUser) {
      // New users (sign-up) go through full onboarding regardless of profile data
      logger.info('New creator user needs onboarding', { userId: user.id, authFlow: 'sign-up' });
      return <Navigate to="/onboarding" replace />;
    } else if (isExistingUser) {
      // Existing users (sign-in) go directly to dashboard
      // Even if profile is incomplete, they shouldn't go through full onboarding
      logger.info('Existing creator user accessing dashboard', { 
        userId: user.id, 
        authFlow: 'sign-in',
        hasUsername: !!profile.username,
        hasFullName: !!profile.full_name
      });
      return <Navigate to="/creator-dashboard" replace />;
    } else {
      // Fallback for unknown auth flow - treat as existing user
      logger.warn('Unknown auth flow for creator, treating as existing user', { userId: user.id });
      return <Navigate to="/creator-dashboard" replace />;
    }
  }

  // Fallback for unknown roles
  logger.warn('User with unknown role accessing dashboard', { 
    userId: user.id, 
    role: profile.role 
  });
  return <Navigate to="/auth" replace />;
}
