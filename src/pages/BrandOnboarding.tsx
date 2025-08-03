
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BrandOnboarding() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!companyName.trim()) {
      toast({ title: "Company name is required", variant: "destructive" });
      return;
    }
    if (!industry.trim()) {
      toast({ title: "Industry is required", variant: "destructive" });
      return;
    }
    
    setLoading(true);

    try {
      // First, ensure the user profile exists
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          role: 'brand',
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
        }, { onConflict: 'id' });

      if (profileError) {
        throw new Error(profileError.message);
      }

      // Then create/update the brand profile
      const { error: brandError } = await supabase
        .from("brand_profiles")
        .upsert({
          id: user.id,
          company_name: companyName,
          industry,
          website,
          company_size: companySize,
        }, { onConflict: 'id' });

      if (brandError) {
        throw new Error(brandError.message);
      }

      toast({ title: "Profile updated", description: "Welcome to Creator Chapter!" });
      navigate("/brand-dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-lg mx-auto py-12 px-4">
      <Card className="border shadow-md bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Brand Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Name<span className="text-red-500">*</span>
              </label>
              <Input 
                value={companyName} 
                onChange={e => setCompanyName(e.target.value)} 
                required 
                placeholder="Your company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Industry<span className="text-red-500">*</span>
              </label>
              <Input 
                value={industry} 
                onChange={e => setIndustry(e.target.value)} 
                required
                placeholder="e.g., Technology, Fashion, Health"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <Input value={website} onChange={e => setWebsite(e.target.value)} type="url" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Size</label>
              <Input value={companySize} onChange={e => setCompanySize(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
