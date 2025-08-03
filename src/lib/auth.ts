
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { create } from 'zustand';
import { logger } from './logger';

export type UserRole = 'creator' | 'brand';

interface UserProfile {
  id: string;
  role: UserRole;
  email: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
  hasRole: (role: UserRole) => boolean;
  isSessionValid: () => boolean;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user 
  }),
  
  setSession: (session) => set({ 
    session,
    isAuthenticated: !!session?.user
  }),
  
  setProfile: (profile) => set({ profile }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ 
        user: null, 
        session: null, 
        profile: null, 
        isAuthenticated: false,
        isLoading: false 
      });
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('Logout error', error);
    }
  },
  
  refreshProfile: async () => {
    const { user } = get();
    if (!user) return null;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, role, email, full_name, username, avatar_url')
        .eq('id', user.id)
        .single();
        
      if (error) {
        logger.error('Failed to fetch user profile', error);
        return null;
      }
      
      const userProfile: UserProfile = {
        id: profile.id,
        role: profile.role as UserRole,
        email: profile.email,
        full_name: profile.full_name,
        username: profile.username,
        avatar_url: profile.avatar_url,
      };
      
      set({ profile: userProfile });
      return userProfile;
    } catch (error) {
      logger.error('Profile refresh error', error);
      return null;
    }
  },
  
  hasRole: (role: UserRole) => {
    const { profile } = get();
    return profile?.role === role;
  },
  
  isSessionValid: () => {
    const { session } = get();
    if (!session) return false;
    
    const now = Date.now() / 1000;
    return session.expires_at ? session.expires_at > now : false;
  },
}));

export const handleError = (error: Error) => {
  logger.error('Authentication error', error);
  return { error: error.message };
};
