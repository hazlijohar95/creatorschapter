
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Link, Save, Trash2, Plus } from "lucide-react";
import { getSocialLinks, saveSocialLink, deleteSocialLink } from "@/services/profileService";

export function BrandSocialMediaProfile() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [socialLinks, setSocialLinks] = useState<{ id?: string; platform: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);

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

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
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
          <div key={idx} className="flex gap-2 items-center">
            <Input
              type="text"
              placeholder="Platform (e.g. Instagram, LinkedIn)"
              className="w-1/4"
              value={link.platform}
              onChange={e => {
                const arr = [...socialLinks];
                arr[idx].platform = e.target.value;
                setSocialLinks(arr);
              }}
            />
            <Input
              type="url"
              placeholder="Profile URL"
              className="w-1/2"
              value={link.url}
              onChange={e => {
                const arr = [...socialLinks];
                arr[idx].url = e.target.value;
                setSocialLinks(arr);
              }}
            />
            <Button 
              size="sm" 
              type="button" 
              onClick={() => handleSaveSocialLink(idx)}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
              Save
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              type="button" 
              onClick={() => handleDeleteSocialLink(idx)}
              disabled={loading}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Remove
            </Button>
          </div>
        ))}
        <Button 
          size="sm" 
          variant="outline" 
          type="button" 
          onClick={handleAddSocialLinkRow}
          disabled={loading}
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Social Link
        </Button>
      </CardContent>
    </Card>
  );
}
