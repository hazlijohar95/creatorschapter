
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

// Target age range options
const AGE_RANGE_OPTIONS = [
  { id: "13-17", label: "13-17" },
  { id: "18-24", label: "18-24" },
  { id: "25-34", label: "25-34" },
  { id: "35-44", label: "35-44" },
  { id: "45-54", label: "45-54" },
  { id: "55+", label: "55+" },
];

// Interest categories
const INTEREST_OPTIONS = [
  { id: "fashion", label: "Fashion" },
  { id: "beauty", label: "Beauty" },
  { id: "travel", label: "Travel" },
  { id: "gaming", label: "Gaming" },
  { id: "fitness", label: "Fitness" },
  { id: "technology", label: "Technology" },
  { id: "food", label: "Food & Cooking" },
  { id: "business", label: "Business" },
  { id: "art", label: "Art & Design" },
  { id: "music", label: "Music" },
  { id: "education", label: "Education" },
  { id: "sports", label: "Sports" },
];

interface BrandIdentityFormProps {
  brandData: any;
  userId: string | undefined;
  onSaveSuccess: () => void;
}

export function BrandIdentityForm({ brandData, userId, onSaveSuccess }: BrandIdentityFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Parse target audience from JSON if it exists
  const existingTargetAudience = brandData?.target_audience || {};
  
  const [targetAudience, setTargetAudience] = useState({
    age_ranges: existingTargetAudience.age_ranges || [],
    interests: existingTargetAudience.interests || [],
    notes: existingTargetAudience.notes || "",
  });

  const handleCheckboxChange = (field: 'age_ranges' | 'interests', value: string) => {
    setTargetAudience(prev => {
      const currentValues = prev[field] || [];
      return {
        ...prev,
        [field]: currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value]
      };
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTargetAudience(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!userId) throw new Error("User not authenticated");

      // Update brand_profiles table with target audience data
      const { error: updateError } = await supabase
        .from("brand_profiles")
        .update({
          target_audience: targetAudience,
        })
        .eq("id", userId);

      // If record doesn't exist, create it
      if (updateError && updateError.code === "PGRST116") {
        const { error: insertError } = await supabase
          .from("brand_profiles")
          .insert({
            id: userId,
            target_audience: targetAudience,
          });

        if (insertError) throw insertError;
      } else if (updateError) {
        throw updateError;
      }

      toast({
        title: "Brand Identity Updated",
        description: "Your target audience preferences have been saved.",
      });
      
      onSaveSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update brand identity",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Target Audience</CardTitle>
        <CardDescription>
          Define your brand's target audience to help match with the right creators
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Age Ranges</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AGE_RANGE_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`age-${option.id}`}
                    checked={targetAudience.age_ranges.includes(option.id)}
                    onCheckedChange={() => handleCheckboxChange('age_ranges', option.id)}
                  />
                  <Label htmlFor={`age-${option.id}`} className="text-sm">{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Audience Interests</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INTEREST_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`interest-${option.id}`}
                    checked={targetAudience.interests.includes(option.id)}
                    onCheckedChange={() => handleCheckboxChange('interests', option.id)}
                  />
                  <Label htmlFor={`interest-${option.id}`} className="text-sm">{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="audience-notes">Additional Target Audience Information</Label>
            <Textarea
              id="audience-notes"
              value={targetAudience.notes}
              onChange={handleNotesChange}
              placeholder="Any other details about your target audience..."
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto flex gap-2" disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Preferences
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
