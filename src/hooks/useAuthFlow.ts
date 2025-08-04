import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth';

export type AuthFlowType = 'sign-up' | 'sign-in' | 'unknown';

export function useAuthFlow() {
  const { user } = useAuthStore();
  const [authFlowType, setAuthFlowType] = useState<AuthFlowType>('unknown');

  useEffect(() => {
    if (!user) {
      setAuthFlowType('unknown');
      return;
    }

    // Check if this is a recent sign-up by looking at user metadata
    // New users (sign-up) will have user_metadata with the full_name and role we set
    const hasSignUpMetadata = user.user_metadata?.full_name && user.user_metadata?.role;
    
    // Also check if the user was created very recently (within last 5 minutes)
    const userCreatedAt = new Date(user.created_at);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const isRecentlyCreated = userCreatedAt > fiveMinutesAgo;

    // Check session storage for explicit sign-up indicator
    let isSignUpSession = false;
    try {
      isSignUpSession = sessionStorage.getItem('isSignUp') === 'true';
    } catch {
      // Ignore sessionStorage errors
    }

    // Determine flow type based on multiple indicators
    if (isSignUpSession || (hasSignUpMetadata && isRecentlyCreated)) {
      setAuthFlowType('sign-up');
    } else {
      setAuthFlowType('sign-in');
    }
  }, [user]);

  return {
    authFlowType,
    isNewUser: authFlowType === 'sign-up',
    isExistingUser: authFlowType === 'sign-in'
  };
}