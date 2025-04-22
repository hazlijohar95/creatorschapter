
import { useEffect, useState } from "react";
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

  useEffect(() => {
    async function recoverSession() {
      try {
        setIsRecovering(true);
        
        // Try to get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(sessionError.message);
        }
        
        if (!sessionData.session) {
          // No session found, redirect to login
          navigate(redirectTo, { replace: true });
          return;
        }
        
        // Session found, update state
        setSession(sessionData.session);
        setUser(sessionData.session.user);
        
      } catch (error: any) {
        console.error("Session recovery error:", error);
        setRecoveryError(error.message || "Failed to recover your session");
        
        toast({
          title: "Session Error",
          description: "We had trouble recovering your session. Please log in again.",
          variant: "destructive"
        });
        
        // Reset auth state and redirect to login
        setUser(null);
        setSession(null);
        navigate(redirectTo, { replace: true });
      } finally {
        setIsRecovering(false);
      }
    }
    
    recoverSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // If session is lost during usage, notify and redirect
      if (!session && user) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive"
        });
        navigate(redirectTo, { replace: true });
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate, redirectTo, setSession, setUser, toast, user]);
  
  return {
    isRecovering,
    recoveryError
  };
}
