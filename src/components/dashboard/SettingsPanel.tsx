import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Loader2, LogOut, UserCog, Layout, CreditCard, Instagram, Target, Link, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Enums } from "@/integrations/supabase/types";

// Import centralized service functions
import {
  getProfile,
  updateProfile,
  getCreatorProfile,
  updateCreatorProfile,
  getSocialLinks,
  saveSocialLink,
  deleteSocialLink,
} from "@/services/profileService";

// Creator-specific categories/niche. You can extend as needed or fetch from a DB table.
const CATEGORY_OPTIONS = [
  "Beauty", "Fashion", "Tech", "Fitness", "Lifestyle", "Food", "Travel", "Gaming", "Education", "Music", "Parenting", "Other"
];

const CONTENT_FORMATS_OPTIONS = [
  "video", "photo", "blog", "podcast", "livestream", "story"
] as const;

const PAYMENT_PREFERENCES_OPTIONS = [
  "Bank Transfer", "PayPal", "Crypto", "Other"
];

export default function SettingsPanel() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();

  // Profile states
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  // Creator profile state
  const [categories, setCategories] = useState<string[]>([]);
  const [contentFormats, setContentFormats] = useState<Enums<"content_format">[]>([]);
  const [paymentPreferences, setPaymentPreferences] = useState<string[]>([]);
  // Social Links
  const [socialLinks, setSocialLinks] = useState<{ id?: string; platform: string; url: string }[]>([]);
  // Loading state
  const [loading, setLoading] = useState(false);

  // Centralized query for all profile data
  const { isLoading, refetch } = useQuery({
    queryKey: ['profile-settings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      // All profile data with centralized service
      const profile = await getProfile(user.id);
      setUsername(profile.username || "");
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
      setEmail(profile.email || "");

      const creatorProfile = await getCreatorProfile(user.id);
      setCategories(Array.isArray(creatorProfile.categories) ? creatorProfile.categories : []);
      setContentFormats(Array.isArray(creatorProfile.content_formats)
        ? creatorProfile.content_formats as Enums<"content_format">[]
        : []);
      setPaymentPreferences(Array.isArray(creatorProfile.payment_preferences) ? creatorProfile.payment_preferences : []);

      const socialLinkRows = await getSocialLinks(user.id);
      setSocialLinks(Array.isArray(socialLinkRows) ? socialLinkRows : []);

      return { profile, creatorProfile, socialLinkRows };
    },
    enabled: !!user
  });

  // ----------- Handlers -----------

  // Save profile using services
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await updateProfile(user.id, { username, full_name: fullName, bio, email });
      await updateCreatorProfile(user.id, {
        categories,
        content_formats: contentFormats,
        payment_preferences: paymentPreferences,
      });
      toast({ title: "Profile updated successfully" });
      refetch();
    } catch (err: any) {
      toast({
        title: "Error updating profile",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add or edit a social link
  const handleSaveSocialLink = async (idx: number) => {
    if (!user) return;
    const link = socialLinks[idx];
    if (!link.platform || !link.url) {
      toast({ title: "Both platform and URL are required.", variant: "destructive" });
      return;
    }
    try {
      await saveSocialLink(user.id, link);
      toast({ title: link.id ? "Social link updated" : "Social link added" });
      refetch();
    } catch (error: any) {
      toast({ title: "Failed to save link", description: error.message, variant: "destructive" });
    }
  };

  // Delete a social link
  const handleDeleteSocialLink = async (idx: number) => {
    const link = socialLinks[idx];
    if (!link.id) {
      setSocialLinks((prev) => prev.filter((_, i) => i !== idx));
      return;
    }
    try {
      await deleteSocialLink(link.id);
      setSocialLinks((prev) => prev.filter((_, i) => i !== idx));
      toast({ title: "Social link removed" });
      refetch();
    } catch (error: any) {
      toast({ title: "Failed to delete link", description: error.message, variant: "destructive" });
    }
  };

  // Manage checkbox lists (category, format, payment)
  const handleArrayToggle = (
    value: string,
    selected: string[],
    setSelected: (v: string[]) => void
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((x) => x !== value));
    } else if (selected.length < 3 || setSelected === setCategories) {
      // Max 3 for categories, unlimited for others
      setSelected([...selected, value]);
    }
  };

  // Handle content format toggle (with type safety)
  const handleContentFormatToggle = (value: Enums<"content_format">) => {
    if (contentFormats.includes(value)) {
      setContentFormats(contentFormats.filter((x) => x !== value));
    } else {
      setContentFormats([...contentFormats, value]);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/auth");
    } else {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Add one blank social link row manually
  const handleAddSocialLinkRow = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  // UI
  if (isLoading) return <div className="flex items-center justify-center p-6"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-8 pb-12">
      <Card>
        <form onSubmit={handleUpdateProfile}>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <UserCog className="w-5 h-5 text-primary" />
              <CardTitle>Creator Profile</CardTitle>
            </div>
            <CardDescription>
              Update your public details and creator-specific info
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label htmlFor="username" className="text-sm font-medium">Username</label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Creator handle"
                />
                <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  disabled
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                />
                <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A short description about yourself"
                  rows={4}
                />
              </div>
              <div className="space-y-4">
                <label className="flex gap-2 items-center text-sm font-medium">
                  <Target className="w-4 h-4" /> Categories/Niche
                  <span className="text-xs text-muted-foreground ml-1">(choose up to 3)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <Button
                      key={cat}
                      type="button"
                      size="sm"
                      variant={categories.includes(cat) ? "secondary" : "outline"}
                      onClick={() => handleArrayToggle(cat, categories, setCategories)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
                <label className="flex gap-2 items-center text-sm font-medium mt-2">
                  <Layout className="w-4 h-4" /> Content Formats
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONTENT_FORMATS_OPTIONS.map((fmt) => (
                    <Button
                      key={fmt}
                      type="button"
                      size="sm"
                      variant={contentFormats.includes(fmt) ? "secondary" : "outline"}
                      onClick={() => handleContentFormatToggle(fmt)}
                    >
                      {fmt.charAt(0).toUpperCase() + fmt.slice(1)}
                    </Button>
                  ))}
                </div>
                <label className="flex gap-2 items-center text-sm font-medium mt-2">
                  <CreditCard className="w-4 h-4" /> Payment Preferences
                </label>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_PREFERENCES_OPTIONS.map((pref) => (
                    <Button
                      key={pref}
                      type="button"
                      size="sm"
                      variant={paymentPreferences.includes(pref) ? "secondary" : "outline"}
                      onClick={() => handleArrayToggle(pref, paymentPreferences, setPaymentPreferences)}
                    >
                      {pref}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="mr-2 w-4 h-4" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
      {/* SOCIAL LINKS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Link className="w-5 h-5 text-primary" />
            <CardTitle>Social Links</CardTitle>
          </div>
          <CardDescription>
            Connect your main social profiles to make it easy for brands to verify you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialLinks.map((link, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <Input
                type="text"
                placeholder="Platform (e.g. Instagram)"
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
              <Button size="sm" type="button" onClick={() => handleSaveSocialLink(idx)}>
                <Save className="w-3 h-3 mr-1" /> Save
              </Button>
              <Button size="sm" variant="destructive" type="button" onClick={() => handleDeleteSocialLink(idx)}>
                Remove
              </Button>
            </div>
          ))}
          <Button size="sm" variant="outline" type="button" onClick={handleAddSocialLinkRow}>Add Social Link</Button>
        </CardContent>
      </Card>
      {/* LOGOUT */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Manage your account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-t border-b py-4">
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
