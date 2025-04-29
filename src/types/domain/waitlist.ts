
/**
 * Waitlist related types
 */

import { z } from "zod";

export const waitlistSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  socialHandle: z.string().optional(),
  followerCount: z.string().optional(),
  niche: z.string().min(1, { message: 'Please select a content niche' })
});

export type WaitlistFormData = z.infer<typeof waitlistSchema>;
