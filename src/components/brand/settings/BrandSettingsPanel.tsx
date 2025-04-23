
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Building, Target, LayoutDashboard, Settings2, CreditCard, LogOut, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CompanyProfileForm } from "./CompanyProfileForm";
import { BrandIdentityForm } from "./BrandIdentityForm";
import { CampaignPreferencesForm } from "./CampaignPreferencesForm";
import { SecuritySettingsForm } from "./SecuritySettingsForm";

export function BrandSettingsPanel() {
  const { user, setUser } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Fetch brand profile data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["brandProfile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Get brand profile information
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (profileError) throw profileError;
      
      // Get brand specific profile data
      const { data: brandData, error: brandError } = await supabase
        .from("brand_profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (brandError && brandError.code !== "PGRST116") throw brandError;
      
      return {
        profile: profileData,
        brandProfile: brandData || {}
      };
    },
    enabled: !!user,
  });

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/auth");
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-500">Error loading profile: {error.message}</p>
              <Button onClick={() => refetch()} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profileData = data?.profile || {};
  const brandData = data?.brandProfile || {};

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Brand Settings</h1>
        <Button variant="destructive" onClick={handleSignOut} className="flex gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden md:inline">Company Profile</span>
            <span className="md:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="brand" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden md:inline">Brand Identity</span>
            <span className="md:hidden">Brand</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden md:inline">Campaign Preferences</span>
            <span className="md:hidden">Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            <span className="hidden md:inline">Security & Account</span>
            <span className="md:hidden">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <CompanyProfileForm 
            profileData={profileData} 
            brandData={brandData} 
            userId={user?.id} 
            onSaveSuccess={() => refetch()} 
          />
        </TabsContent>

        <TabsContent value="brand">
          <BrandIdentityForm 
            brandData={brandData} 
            userId={user?.id} 
            onSaveSuccess={() => refetch()} 
          />
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignPreferencesForm 
            brandData={brandData} 
            userId={user?.id} 
            onSaveSuccess={() => refetch()} 
          />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettingsForm 
            profileData={profileData} 
            userId={user?.id} 
            onSignOut={handleSignOut}
            onSaveSuccess={() => refetch()} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
