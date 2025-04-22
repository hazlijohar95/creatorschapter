
// Validation utilities for social media profiles

/**
 * Check if a URL is valid for a specific social media platform
 */
export const validateSocialUrl = (url: string, platform: string): { valid: boolean; message?: string } => {
  if (!url) return { valid: true }; // Empty URLs are valid (optional fields)
  
  // Basic URL validation
  try {
    new URL(url);
  } catch (e) {
    return { valid: false, message: "Please enter a valid URL" };
  }
  
  // Platform-specific validation
  const platformValidators: Record<string, (url: string) => boolean> = {
    instagram: (url) => url.includes("instagram.com/") || url.includes("instagr.am/"),
    twitter: (url) => url.includes("twitter.com/") || url.includes("x.com/"),
    tiktok: (url) => url.includes("tiktok.com/") || url.includes("vm.tiktok.com/"),
    youtube: (url) => url.includes("youtube.com/") || url.includes("youtu.be/"),
  };
  
  if (platformValidators[platform.toLowerCase()]) {
    const isValid = platformValidators[platform.toLowerCase()](url);
    return isValid ? { valid: true } : { 
      valid: false, 
      message: `This doesn't look like a valid ${platform} URL`
    };
  }
  
  return { valid: true };
};

/**
 * Ensure URL has proper protocol
 */
export const ensureHttps = (url: string): string => {
  if (!url) return url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};
