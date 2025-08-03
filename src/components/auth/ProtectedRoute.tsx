
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore, UserRole } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { AuthSkeleton, ProfileSkeleton } from "@/components/shared/QuickSkeleton";

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  requireProfile?: boolean;
}

export default function ProtectedRoute({ 
  requiredRole, 
  requireProfile = false 
}: ProtectedRouteProps) {
  const { 
    user, 
    session, 
    profile, 
    isLoading, 
    isAuthenticated, 
    isSessionValid,
    hasRole 
  } = useAuthStore();
  const location = useLocation();

  // Show skeleton while authentication state is being determined
  if (isLoading) {
    return <AuthSkeleton />;
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user || !session) {
    logger.warn('Unauthorized access attempt', { 
      path: location.pathname,
      hasUser: !!user,
      hasSession: !!session 
    });
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Check session validity
  if (!isSessionValid()) {
    logger.warn('Invalid or expired session', { 
      path: location.pathname,
      userId: user.id 
    });
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Check if profile is required and loaded
  if (requireProfile && !profile) {
    logger.warn('Profile required but not loaded', { 
      path: location.pathname,
      userId: user.id 
    });
    return <ProfileSkeleton />;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    const userRole = profile?.role;
    logger.warn('Insufficient permissions', { 
      path: location.pathname,
      userId: user.id,
      userRole,
      requiredRole 
    });
    
    // Redirect to appropriate dashboard based on actual role
    const redirectPath = userRole === 'brand' ? '/brand-dashboard' : '/creator-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
