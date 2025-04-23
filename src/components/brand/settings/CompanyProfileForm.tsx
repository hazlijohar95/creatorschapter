
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

// Company size options
const COMPANY_SIZE_OPTIONS = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1001+", label: "1001+ employees" },
];

// Industry options
const INDUSTRY_OPTIONS = [
  "Fashion & Apparel",
  "Beauty & Cosmetics", 
  "Health & Wellness",
  "Food & Beverage",
  "Travel & Hospitality",
  "Technology",
  "Finance",
  "Entertainment",
  "Education",
  "Home & Decor",
  "Sports & Fitness",
  "Gaming",
  "Other"
];

interface CompanyProfileFormProps {
  profileData: any;
  brandData: any;
  userId: string | undefined;
  onSaveSuccess: () => void;
}

export function CompanyProfileForm({ profileData, brandData, userId, onSaveSuccess }: CompanyProfileFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profileData?.full_name || "",
    bio: profileData?.bio || "",
    location: profileData?.location || "",
    website: profileData?.website_url || brandData?.website || "",
    companyName: brandData?.company_name || "",
    industry: brandData?.industry || "",
    companySize: brandData?.company_size || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!userId) throw new Error("User not authenticated");

      // Update profile table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          bio: formData.bio,
          location: formData.location,
          website_url: formData.website,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      // Update brand_profiles table
      const { error: brandError } = await supabase
        .from("brand_profiles")
        .update({
          company_name: formData.companyName,
          industry: formData.industry,
          company_size: formData.companySize,
          website: formData.website,
        })
        .eq("id", userId);

      // If brand profile doesn't exist yet, insert it
      if (brandError && brandError.code === "PGRST116") {
        const { error: insertError } = await supabase
          .from("brand_profiles")
          .insert({
            id: userId,
            company_name: formData.companyName,
            industry: formData.industry,
            company_size: formData.companySize,
            website: formData.website,
          });

        if (insertError) throw insertError;
      } else if (brandError) {
        throw brandError;
      }

      toast({
        title: "Profile Updated",
        description: "Your company profile has been updated successfully.",
      });
      
      onSaveSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Profile</CardTitle>
        <CardDescription>
          Update your company information and public profile
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter your company name"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select 
                value={formData.industry} 
                onValueChange={(value) => handleSelectChange("industry", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_OPTIONS.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companySize">Company Size</Label>
              <Select 
                value={formData.companySize} 
                onValueChange={(value) => handleSelectChange("companySize", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Contact Person</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full name of primary contact"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                type="url"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Company Description</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell creators about your company..."
              rows={4}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="ml-auto flex gap-2" disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
