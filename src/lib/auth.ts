
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  session: Session | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  signout: () => Promise<void>; // Add signout method
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  signout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));

export const handleError = (error: Error) => {
  console.error('Authentication error:', error);
  return { error: error.message };
};
