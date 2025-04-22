
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

/**
 * A hook that handles session recovery and persistence
 * with enhanced error handling and user feedback
 */
export function useSessionRecovery(redirectTo: string = "/auth") {
  const { user, setUser, setSession } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRecovering, setIsRecovering] = useState(true);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Use useCallback to prevent recreation of this function on every render
  const handleSessionChange = useCallback((session: any) => {
    setSession(session);
    setUser(session?.user ?? null);
  }, [setSession, setUser]);

  // Handle session loss during usage
  const handleSessionLoss = useCallback(() => {
    if (user) {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive"
      });
      navigate(redirectTo, { replace: true });
    }
  }, [user, toast, navigate, redirectTo]);

  useEffect(() => {
    let isMounted = true;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    
    async function recoverSession() {
      try {
        if (!isMounted) return;
        setIsRecovering(true);
        
        // Try to get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(sessionError.message);
        }
        
        if (!sessionData.session) {
          // No session found, redirect to login
          if (isMounted) {
            // Add a small delay to prevent potential race conditions
            timeout = setTimeout(() => {
              navigate(redirectTo, { replace: true });
            }, 100);
            return;
          }
        }
        
        // Session found, update state
        if (isMounted) {
          handleSessionChange(sessionData.session);
        }
        
      } catch (error: any) {
        console.error("Session recovery error:", error);
        if (isMounted) {
          setRecoveryError(error.message || "Failed to recover your session");
          
          toast({
            title: "Session Error",
            description: "We had trouble recovering your session. Please log in again.",
            variant: "destructive"
          });
          
          // Reset auth state and redirect to login
          setUser(null);
          setSession(null);
          
          timeout = setTimeout(() => {
            navigate(redirectTo, { replace: true });
          }, 100);
        }
      } finally {
        if (isMounted) {
          setIsRecovering(false);
        }
      }
    }
    
    recoverSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (isMounted) {
        handleSessionChange(session);
      
        // If session is lost during usage, notify and redirect
        if (!session && user) {
          handleSessionLoss();
        }
      }
    });
    
    return () => {
      isMounted = false;
      if (timeout) clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [navigate, redirectTo, handleSessionChange, handleSessionLoss, user]);
  
  return {
    isRecovering,
    recoveryError
  };
}
