// src/services/profileCreationService.ts
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

export type UserRole = 'creator' | 'brand';

interface CreateProfileParams {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
}

/**
 * Creates initial profile entries for a new user
 * This should be called right after successful signup
 */
export async function createInitialProfile({
  userId,
  email,
  fullName,
  role
}: CreateProfileParams): Promise<{ success: boolean; error?: string }> {
  try {
    logger.info('Creating initial profile', { userId, email, role });

    // Create the main profile entry
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        role,
        email,
        full_name: fullName,
      }, { onConflict: 'id' });

    if (profileError) {
      logger.error('Failed to create main profile', profileError, { userId });
      return { success: false, error: profileError.message };
    }

    // Create role-specific profile entries
    if (role === 'creator') {
      const { error: creatorProfileError } = await supabase
        .from("creator_profiles")
        .upsert({
          id: userId,
        }, { onConflict: 'id' });

      if (creatorProfileError) {
        logger.error('Failed to create creator profile', creatorProfileError, { userId });
        return { success: false, error: creatorProfileError.message };
      }
    } else if (role === 'brand') {
      const { error: brandProfileError } = await supabase
        .from("brand_profiles")
        .upsert({
          id: userId,
        }, { onConflict: 'id' });

      if (brandProfileError) {
        logger.error('Failed to create brand profile', brandProfileError, { userId });
        return { success: false, error: brandProfileError.message };
      }
    }

    logger.info('Initial profile created successfully', { userId, role });
    return { success: true };

  } catch (error: any) {
    logger.error('Unexpected error creating initial profile', error, { userId });
    return { success: false, error: error.message };
  }
}

/**
 * Checks if a user has completed their profile setup
 */
export async function checkProfileCompleteness(userId: string): Promise<{
  hasMainProfile: boolean;
  hasRoleProfile: boolean;
  role?: UserRole;
}> {
  try {
    // Check main profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", userId)
      .maybeSingle();

    if (!profile) {
      return { hasMainProfile: false, hasRoleProfile: false };
    }

    // Check role-specific profile
    let hasRoleProfile = false;
    if (profile.role === 'creator') {
      const { data: creatorProfile } = await supabase
        .from("creator_profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();
      hasRoleProfile = !!creatorProfile;
    } else if (profile.role === 'brand') {
      const { data: brandProfile } = await supabase
        .from("brand_profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();
      hasRoleProfile = !!brandProfile;
    }

    return {
      hasMainProfile: true,
      hasRoleProfile,
      role: profile.role as UserRole
    };

  } catch (error: any) {
    logger.error('Error checking profile completeness', error, { userId });
    return { hasMainProfile: false, hasRoleProfile: false };
  }
}