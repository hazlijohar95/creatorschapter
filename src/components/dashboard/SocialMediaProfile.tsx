
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Link as LinkIcon, Check, Info, PieChart, Users } from "lucide-react";
import { getSocialLinks, saveSocialLink } from "@/services/profileService";

// Social media platform icons and colors
const PLATFORM_CONFIG: Record<string, { icon: string; color: string; }> = {
  instagram: { icon: "instagram", color: "#E1306C" },
  twitter: { icon: "twitter", color: "#1DA1F2" },
  youtube: { icon: "youtube", color: "#FF0000" },
  tiktok: { icon: "music", color: "#000000" },
  facebook: { icon: "facebook", color: "#1877F2" },
  linkedin: { icon: "linkedin", color: "#0077B5" },
  pinterest: { icon: "image", color: "#E60023" },
  twitch: { icon: "twitch", color: "#9146FF" },
};

export default function SocialMediaProfile() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    instagram: "",
    twitter: "",
    youtube: "",
    tiktok: "",
  });
  const [location, setLocation] = useState({
    country: "",
    city: ""
  });
  const [demographics, setDemographics] = useState({
    ageGroup: "",
    gender: "",
    interests: ""
  });
  const [saving, setSaving] = useState(false);

  // Fetch social links if user is logged in
  const { isLoading } = useQuery({
    queryKey: ['creator-social-links', user?.id],
    queryFn: async () => {
      if (!user) return [];
      try {
        const links = await getSocialLinks(user.id);
        if (links) {
          const socialMap: Record<string, string> = {};
          links.forEach((link: any) => {
            const platform = link.platform.toLowerCase();
            socialMap[platform] = link.url;
          });
          setSocialLinks(prevLinks => ({...prevLinks, ...socialMap}));
        }
        return links;
      } catch (error) {
        console.error("Failed to fetch social links:", error);
        return [];
      }
    },
    enabled: !!user
  });

  const handleSocialLinkChange = (platform: string, url: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform.toLowerCase()]: url
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your profile",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      // Save each social link
      for (const [platform, url] of Object.entries(socialLinks)) {
        if (url) {
          await saveSocialLink(user.id, { platform, url });
        }
      }
      
      toast({
        title: "Profile updated",
        description: "Your social media profile has been saved successfully",
        icon: <Check className="h-4 w-4 text-green-500" />
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Social Media Card Component
  const SocialMediaCard = () => (
    <Card className="backdrop-blur-sm bg-gradient-to-br from-card to-card/90 border-muted/20 shadow-lg transform transition-all hover:shadow-xl">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center space-x-2">
          <LinkIcon className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Social Media Links</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Connect your profiles to showcase your online presence
        </p>
      </CardHeader>
      <CardContent className="grid gap-5">
        {Object.entries(PLATFORM_CONFIG).slice(0, 4).map(([platform, config]) => (
          <div 
            key={platform}
            className="group relative space-y-1 animate-fade-in"
          >
            <label htmlFor={platform} className="flex items-center text-sm font-medium">
              <span 
                className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <span 
                  className={`text-sm font-semibold`}
                  style={{ color: config.color }}
                >
                  {platform.charAt(0).toUpperCase()}
                </span>
              </span>
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </label>
            <div className="relative">
              <Input
                id={platform}
                placeholder={`Your ${platform} profile URL`}
                value={socialLinks[platform] || ""}
                onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                className="pr-8 transition-all border-muted/20 focus:border-primary/40"
              />
              {socialLinks[platform] && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
                      <Info className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 text-sm">
                    <div className="space-y-2">
                      <p className="font-semibold">Profile Preview</p>
                      <p className="text-xs text-muted-foreground">{socialLinks[platform]}</p>
                      <a 
                        href={socialLinks[platform]} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Visit Profile
                      </a>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  // Location Card Component
  const LocationCard = () => (
    <Card className="backdrop-blur-sm bg-gradient-to-br from-card to-card/90 border-muted/20 shadow-lg transform transition-all hover:shadow-xl">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary" />
          Location & Demographics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium">Country</label>
          <Select value={location.country} onValueChange={(value) => setLocation(prev => ({ ...prev, country: value }))}>
            <SelectTrigger className="w-full border-muted/20 bg-card hover:border-primary/40 transition-colors">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usa">United States</SelectItem>
              <SelectItem value="canada">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="australia">Australia</SelectItem>
              <SelectItem value="germany">Germany</SelectItem>
              <SelectItem value="france">France</SelectItem>
              <SelectItem value="japan">Japan</SelectItem>
              <SelectItem value="india">India</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">City</label>
          <Input
            id="city"
            placeholder="Enter your city"
            value={location.city}
            onChange={(e) => setLocation(prev => ({ ...prev, city: e.target.value }))}
            className="border-muted/20 focus:border-primary/40"
          />
        </div>
      </CardContent>
    </Card>
  );

  // Demographics Card Component
  const DemographicsCard = () => (
    <Card className="backdrop-blur-sm bg-gradient-to-br from-card to-card/90 border-muted/20 shadow-lg transform transition-all hover:shadow-xl">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl flex items-center">
          <PieChart className="h-5 w-5 mr-2 text-primary" />
          Target Audience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Age Group</label>
          <Select 
            value={demographics.ageGroup} 
            onValueChange={(value) => setDemographics(prev => ({ ...prev, ageGroup: value }))}
          >
            <SelectTrigger className="w-full border-muted/20 bg-card hover:border-primary/40 transition-colors">
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="13-17">13-17</SelectItem>
              <SelectItem value="18-24">18-24</SelectItem>
              <SelectItem value="25-34">25-34</SelectItem>
              <SelectItem value="35-44">35-44</SelectItem>
              <SelectItem value="45+">45+</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="pt-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-xs flex items-center text-muted-foreground hover:text-primary transition-colors">
                  <Info className="h-3 w-3 mr-1" /> Why is this important?
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 text-sm">
                <div className="space-y-2">
                  <p className="font-medium">Audience Demographics</p>
                  <p className="text-xs text-muted-foreground">
                    Sharing your audience demographics helps brands find the right creators for their campaigns. 
                    This increases your chances of being selected for opportunities that match your audience.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Gender Distribution</label>
          <Select 
            value={demographics.gender} 
            onValueChange={(value) => setDemographics(prev => ({ ...prev, gender: value }))}
          >
            <SelectTrigger className="w-full border-muted/20 bg-card hover:border-primary/40 transition-colors">
              <SelectValue placeholder="Select primary gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Primarily Male</SelectItem>
              <SelectItem value="female">Primarily Female</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="interests" className="text-sm font-medium">Interests</label>
          <div className="relative">
            <Input
              id="interests"
              placeholder="e.g., fitness, travel, tech"
              value={demographics.interests}
              onChange={(e) => setDemographics(prev => ({ ...prev, interests: e.target.value }))}
              className="border-muted/20 focus:border-primary/40"
            />
            <Popover>
              <PopoverTrigger asChild>
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                  <Info className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 text-sm p-4">
                <p className="font-medium mb-2">Interest Tags</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Enter comma-separated interests that best describe your audience.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Travel', 'Fashion', 'Gaming', 'Food', 'Tech', 'Fitness', 'Beauty'].map(tag => (
                    <button
                      key={tag}
                      className="px-2 py-1 bg-primary/10 text-xs rounded-full hover:bg-primary/20 transition-colors"
                      onClick={() => {
                        const currentTags = demographics.interests ? demographics.interests.split(/,\s*/) : [];
                        if (!currentTags.includes(tag)) {
                          const newTags = [...currentTags, tag].filter(Boolean).join(", ");
                          setDemographics(prev => ({ ...prev, interests: newTags }));
                        }
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-space font-bold">Social Media & Demographics</h2>
        <Button 
          onClick={handleSaveProfile} 
          disabled={saving || isLoading}
          className="bg-gradient-to-r from-primary to-primary/80 shadow-md hover:shadow-lg transition-all"
        >
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SocialMediaCard />
        <div className="space-y-6">
          <LocationCard />
          <DemographicsCard />
        </div>
      </div>
    </div>
  );
}
