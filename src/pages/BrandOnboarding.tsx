
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
    setLoading(true);

    const { error } = await supabase
      .from("brand_profiles")
      .update({
        company_name: companyName,
        industry,
        website,
        company_size: companySize,
      })
      .eq("id", user.id);

    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated", description: "Welcome to Creator Chapter!" });
      navigate("/brand-dashboard");
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
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <Input value={companyName} onChange={e => setCompanyName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <Input value={industry} onChange={e => setIndustry(e.target.value)} required />
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
