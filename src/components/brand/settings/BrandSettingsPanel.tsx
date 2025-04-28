
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandIdentityForm } from "./BrandIdentityForm";
import { CompanyProfileForm } from "./CompanyProfileForm";
import { CampaignPreferencesForm } from "./CampaignPreferencesForm";
import { SecuritySettingsForm } from "./SecuritySettingsForm";
import { BrandSocialMediaProfile } from "./BrandSocialMediaProfile";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export function BrandSettingsPanel() {
  const [activeTab, setActiveTab] = useState("identity");
  const [profileData, setProfileData] = useState(null);
  const [brandData, setBrandData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfileData() {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Fetch brand profile data
        const { data: brandData, error: brandError } = await supabase
          .from("brand_profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (brandError && brandError.code !== "PGRST116") throw brandError;
        
        setProfileData(profileData);
        setBrandData(brandData || {});
      } catch (error: any) {
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProfileData();
  }, [user, toast]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleProfileUpdate = () => {
    // Refresh data after updates
    if (user?.id) {
      // We could do a full fetch here, but for simplicity just show a toast
      toast({
        title: "Settings Updated",
        description: "Your settings have been saved successfully.",
      });
    }
  };

  if (isLoading) {
    return <div className="p-6 flex justify-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Brand Settings</h1>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-6"
      >
        <TabsList className="grid md:grid-cols-5 grid-cols-2 h-auto">
          <TabsTrigger value="identity" className="py-3">
            Brand Identity
          </TabsTrigger>
          <TabsTrigger value="company" className="py-3">
            Company Profile
          </TabsTrigger>
          <TabsTrigger value="social" className="py-3">
            Social Media
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="py-3">
            Campaign Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="py-3">
            Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="identity" className="space-y-6">
          <BrandIdentityForm 
            brandData={brandData} 
            userId={user?.id} 
            onSaveSuccess={handleProfileUpdate}
          />
        </TabsContent>
        
        <TabsContent value="company" className="space-y-6">
          <CompanyProfileForm 
            profileData={profileData}
            brandData={brandData}
            userId={user?.id}
            onSaveSuccess={handleProfileUpdate}
          />
        </TabsContent>
        
        <TabsContent value="social" className="space-y-6">
          <BrandSocialMediaProfile />
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-6">
          <CampaignPreferencesForm 
            brandData={brandData}
            userId={user?.id}
            onSaveSuccess={handleProfileUpdate}
          />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <SecuritySettingsForm 
            profileData={profileData}
            userId={user?.id}
            onSignOut={handleSignOut}
            onSaveSuccess={handleProfileUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
