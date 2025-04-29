
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Link, Save, Trash2, Plus, ExternalLink } from "lucide-react";
import { getSocialLinks, saveSocialLink, deleteSocialLink } from "@/services/profileService";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

// Social media platform suggestions
const PLATFORM_SUGGESTIONS = [
  "LinkedIn", "Twitter", "Instagram", "Facebook", "YouTube", 
  "TikTok", "Pinterest", "Website", "Blog"
];

export function BrandSocialMediaProfile() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [socialLinks, setSocialLinks] = useState<{ id?: string; platform: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Fetch social links
  const { isLoading, refetch } = useQuery({
    queryKey: ['brand-social-links', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const socialLinkRows = await getSocialLinks(user.id);
      setSocialLinks(Array.isArray(socialLinkRows) ? socialLinkRows : []);
      return socialLinkRows;
    },
    enabled: !!user
  });

  // Add one blank social link row
  const handleAddSocialLinkRow = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  // Save a social link
  const handleSaveSocialLink = async (idx: number) => {
    if (!user) return;
    const link = socialLinks[idx];
    if (!link.platform || !link.url) {
      toast({ 
        title: "Both platform and URL are required.", 
        variant: "destructive" 
      });
      return;
    }
    
    setLoading(true);
    try {
      await saveSocialLink(user.id, link);
      toast({ 
        title: link.id ? "Social link updated" : "Social link added" 
      });
      refetch();
    } catch (error: any) {
      toast({ 
        title: "Failed to save link", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a social link
  const handleDeleteSocialLink = async (idx: number) => {
    const link = socialLinks[idx];
    if (!link.id) {
      setSocialLinks((prev) => prev.filter((_, i) => i !== idx));
      return;
    }

    setLoading(true);
    try {
      await deleteSocialLink(link.id);
      setSocialLinks((prev) => prev.filter((_, i) => i !== idx));
      toast({ title: "Social link removed" });
    } catch (error: any) {
      toast({ 
        title: "Failed to delete link", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Platform suggestions popover
  const PlatformSuggestions = ({ index }: { index: number }) => (
    <div className="absolute top-full left-0 mt-1 z-10 bg-popover p-2 rounded-md shadow-lg border border-border w-full max-h-32 overflow-y-auto">
      <div className="grid grid-cols-2 gap-1">
        {PLATFORM_SUGGESTIONS.map((platform) => (
          <button
            key={platform}
            className="text-xs px-2 py-1 text-left hover:bg-muted rounded transition-colors"
            onClick={() => {
              const newLinks = [...socialLinks];
              newLinks[index].platform = platform;
              setSocialLinks(newLinks);
            }}
          >
            {platform}
          </button>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-gradient-to-br from-card to-card/90 border-muted/20 shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Link className="w-5 h-5 text-primary" />
          <CardTitle>Company Social Media</CardTitle>
        </div>
        <CardDescription>
          Connect your brand's social media profiles to provide more information to creators.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {socialLinks.map((link, idx) => (
          <div 
            key={idx} 
            className="flex gap-2 items-center group animate-fade-in relative"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative w-1/4">
              <Input
                type="text"
                placeholder="Platform (e.g. Instagram)"
                className="w-full border-muted/20 focus:border-primary/40 transition-all"
                value={link.platform}
                onChange={e => {
                  const arr = [...socialLinks];
                  arr[idx].platform = e.target.value;
                  setSocialLinks(arr);
                }}
                onFocus={() => setHoveredIndex(idx)}
              />
              {hoveredIndex === idx && link.platform === "" && (
                <PlatformSuggestions index={idx} />
              )}
            </div>
            
            <div className="relative w-1/2">
              <Input
                type="url"
                placeholder="Profile URL"
                className="w-full border-muted/20 focus:border-primary/40 transition-all pr-8"
                value={link.url}
                onChange={e => {
                  const arr = [...socialLinks];
                  arr[idx].url = e.target.value;
                  setSocialLinks(arr);
                }}
              />
              {link.url && (
                <a 
                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            
            <HoverCard openDelay={300} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Button 
                  size="sm" 
                  type="button" 
                  onClick={() => handleSaveSocialLink(idx)}
                  disabled={loading}
                  className="bg-primary/90 hover:bg-primary transition-colors shadow-sm"
                >
                  {loading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
                  Save
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto p-2">
                <span className="text-xs">Save this social link</span>
              </HoverCardContent>
            </HoverCard>
            
            <HoverCard openDelay={300} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  type="button" 
                  onClick={() => handleDeleteSocialLink(idx)}
                  disabled={loading}
                  className="bg-destructive/80 hover:bg-destructive transition-colors"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-auto p-2">
                <span className="text-xs">Delete this social link</span>
              </HoverCardContent>
            </HoverCard>
          </div>
        ))}
        
        <Button 
          size="sm" 
          variant="outline" 
          type="button" 
          onClick={handleAddSocialLinkRow}
          disabled={loading}
          className="mt-2 border-primary/20 hover:border-primary text-primary/90 hover:text-primary transition-all"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Social Link
        </Button>
      </CardContent>
    </Card>
  );
}
