
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Link as LinkIcon, Users, Check, PieChart } from "lucide-react";
import { getSocialLinks, saveSocialLink } from "@/services/profileService";
import { SocialProfilePreview } from "./social/SocialProfilePreview";
import { AudienceDemographicsChart } from "./social/AudienceDemographicsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SocialMediaProfile from "./SocialMediaProfile";

export default function SocialMediaProfileAdvanced() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Fetch social links
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
          setSocialLinks(socialMap);
        }
        return links;
      } catch (error) {
        console.error("Failed to fetch social links:", error);
        return [];
      }
    },
    enabled: !!user
  });

  // Original SocialMediaProfile component for form inputs
  const SocialMediaInputForm = () => <SocialMediaProfile />;

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-lg shadow-sm mb-8 animate-fade-in">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold font-space mb-2">Social Media Profiles</h1>
          <p className="text-muted-foreground">
            Connect your social media accounts and share audience demographics to help brands 
            understand your reach and find the perfect partnership opportunities.
          </p>
        </div>
      </div>
      
      {/* Social Media Previews */}
      {!isLoading && Object.keys(socialLinks).length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold font-space">Your Connected Profiles</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(socialLinks).map(([platform, url]) => (
              url && <SocialProfilePreview key={platform} platform={platform} url={url} />
            ))}
          </div>
        </div>
      )}
      
      {/* Audience Demographics Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AudienceDemographicsChart className="h-full" />
        </div>
        
        <Card className="backdrop-blur-sm bg-gradient-to-br from-card to-card/90 border-muted/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Audience Reach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Instagram Followers</span>
                <span className="font-semibold">3.2K</span>
              </div>
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#E1306C] to-[#F77737] rounded-full" style={{width: '65%'}}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Twitter Followers</span>
                <span className="font-semibold">1.8K</span>
              </div>
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#1DA1F2] to-[#1DA1F2]/60 rounded-full" style={{width: '40%'}}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>TikTok Followers</span>
                <span className="font-semibold">5.7K</span>
              </div>
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-black to-black/60 rounded-full" style={{width: '80%'}}></div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground mt-4 pt-4 border-t border-muted/20">
              <p className="mb-2">Engagement statistics are shown to help brands assess potential partnership success.</p>
              <p>Connect more accounts to improve your profile completeness.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Social Media Input Form */}
      <div className="mt-8">
        <SocialMediaInputForm />
      </div>
    </div>
  );
}
