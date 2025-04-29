
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Twitter, Youtube, Music } from "lucide-react";

interface SocialProfilePreviewProps {
  platform: string;
  username?: string;
  url?: string;
}

export function SocialProfilePreview({ platform, username, url }: SocialProfilePreviewProps) {
  // Extract username from URL if not provided
  const displayName = username || extractUsernameFromUrl(platform, url || '');
  
  // Platform config
  const platformConfig: Record<string, { 
    icon: React.ReactNode; 
    color: string;
    bgColor: string;
    pattern: string;
  }> = {
    instagram: {
      icon: <Instagram className="h-6 w-6" />,
      color: "#E1306C",
      bgColor: "#FCE7F3",
      pattern: "radial-gradient(circle, #FCDFEB 1px, transparent 1px) 0 0/10px 10px"
    },
    twitter: {
      icon: <Twitter className="h-6 w-6" />,
      color: "#1DA1F2",
      bgColor: "#E0F2FE",
      pattern: "linear-gradient(135deg, #E0F2FE 25%, transparent 25%) -10px 0, linear-gradient(225deg, #E0F2FE 25%, transparent 25%) -10px 0"
    },
    youtube: {
      icon: <Youtube className="h-6 w-6" />,
      color: "#FF0000",
      bgColor: "#FEE2E2",
      pattern: "repeating-linear-gradient(45deg, #FEE2E2, #FEE2E2 5px, transparent 5px, transparent 10px)"
    },
    tiktok: {
      icon: <Music className="h-6 w-6" />,
      color: "#000000",
      bgColor: "#F3F4F6",
      pattern: "repeating-radial-gradient(#D1D5DB 0 1px, transparent 1px 8px)"
    }
  };
  
  // Default if platform not found
  const defaultConfig = {
    icon: <Instagram className="h-6 w-6" />,
    color: "#6E59A5",
    bgColor: "#E5DEFF",
    pattern: "radial-gradient(circle, #E5DEFF 1px, transparent 1px) 0 0/10px 10px"
  };
  
  // Get config for the platform (case insensitive)
  const config = platformConfig[platform.toLowerCase()] || defaultConfig;
  
  return (
    <Card className="overflow-hidden border-transparent shadow-md group hover:shadow-lg transition-all">
      <div 
        className="h-20 relative"
        style={{ 
          background: config.bgColor,
          backgroundImage: config.pattern,
          backgroundColor: config.bgColor
        }}
      >
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ 
            background: `linear-gradient(45deg, ${config.color}33, ${config.color}66)`
          }}
        />
        <div className="absolute bottom-0 right-0 m-2 bg-white rounded-full p-1 shadow-sm" style={{ color: config.color }}>
          {config.icon}
        </div>
      </div>
      
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center" 
            style={{ backgroundColor: `${config.color}20` }}
          >
            <span className="text-xs font-bold" style={{ color: config.color }}>
              {displayName ? displayName.charAt(0).toUpperCase() : platform.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="overflow-hidden">
            <div className="text-sm font-medium truncate">
              {displayName || `Your ${platform} Profile`}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {url || `Connect your ${platform} account`}
            </div>
          </div>
        </div>
        
        <div className="mt-2 text-xs flex justify-between">
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
            <span>Active</span>
          </div>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:underline"
            onClick={(e) => !url && e.preventDefault()}
          >
            View Profile →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

function extractUsernameFromUrl(platform: string, url: string): string {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    
    switch (platform.toLowerCase()) {
      case 'instagram':
        return pathSegments[0] || '';
      case 'twitter':
        return pathSegments[0] || '';
      case 'youtube':
        // YouTube profiles are complex, just return a placeholder
        return pathSegments[0] || '';
      case 'tiktok':
        return pathSegments[0] || '';
      default:
        // Generic extraction attempt
        return pathSegments[0] || '';
    }
  } catch (e) {
    // If URL parsing fails, just return an empty string
    return '';
  }
}
