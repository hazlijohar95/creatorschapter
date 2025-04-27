
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandIdentityForm } from "./BrandIdentityForm";
import { CompanyProfileForm } from "./CompanyProfileForm";
import { CampaignPreferencesForm } from "./CampaignPreferencesForm";
import { SecuritySettingsForm } from "./SecuritySettingsForm";

export function BrandSettingsPanel() {
  const [activeTab, setActiveTab] = useState("identity");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Brand Settings</h1>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-6"
      >
        <TabsList className="grid md:grid-cols-4 grid-cols-2 h-auto">
          <TabsTrigger value="identity" className="py-3">
            Brand Identity
          </TabsTrigger>
          <TabsTrigger value="company" className="py-3">
            Company Profile
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="py-3">
            Campaign Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="py-3">
            Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="identity" className="space-y-6">
          <BrandIdentityForm />
        </TabsContent>
        
        <TabsContent value="company" className="space-y-6">
          <CompanyProfileForm />
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-6">
          <CampaignPreferencesForm />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <SecuritySettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
