
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Collaboration types
const COLLABORATION_TYPES = [
  { id: "sponsored_post", label: "Sponsored Post" },
  { id: "product_review", label: "Product Review" },
  { id: "brand_ambassador", label: "Brand Ambassador" },
  { id: "affiliate_marketing", label: "Affiliate Marketing" },
  { id: "event_appearance", label: "Event Appearance" },
  { id: "content_creation", label: "Content Creation" },
];

// Content formats
const CONTENT_FORMATS = [
  { id: "video", label: "Video" },
  { id: "photo", label: "Photo" },
  { id: "blog", label: "Blog" },
  { id: "podcast", label: "Podcast" },
  { id: "livestream", label: "Livestream" },
  { id: "story", label: "Story" },
];

// Budget ranges
const BUDGET_RANGES = [
  { id: "under_1k", label: "Under $1,000" },
  { id: "1k_5k", label: "$1,000 - $5,000" },
  { id: "5k_10k", label: "$5,000 - $10,000" },
  { id: "10k_50k", label: "$10,000 - $50,000" },
  { id: "50k_plus", label: "Over $50,000" },
];

interface CampaignPreferencesFormProps {
  brandData: any;
  userId: string | undefined;
  onSaveSuccess: () => void;
}

export function CampaignPreferencesForm({ brandData, userId, onSaveSuccess }: CampaignPreferencesFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Parse campaign preferences from JSON if they exist
  const existingPreferences = brandData?.campaign_preferences || {};
  
  const [preferences, setPreferences] = useState({
    collaboration_types: existingPreferences.collaboration_types || [],
    content_formats: existingPreferences.content_formats || [],
    typical_budget: existingPreferences.typical_budget || "",
    goals: existingPreferences.goals || [],
    notes: existingPreferences.notes || "",
  });

  // For managing custom goals input
  const [newGoal, setNewGoal] = useState("");

  const handleCheckboxChange = (field: 'collaboration_types' | 'content_formats', value: string) => {
    setPreferences(prev => {
      const currentValues = prev[field] || [];
      return {
        ...prev,
        [field]: currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value]
      };
    });
  };

  const handleBudgetChange = (value: string) => {
    setPreferences(prev => ({
      ...prev,
      typical_budget: value
    }));
  };

  const handleAddGoal = () => {
    if (newGoal.trim() && !preferences.goals.includes(newGoal.trim())) {
      setPreferences(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()]
      }));
      setNewGoal("");
    }
  };

  const handleRemoveGoal = (goal: string) => {
    setPreferences(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g !== goal)
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPreferences(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!userId) throw new Error("User not authenticated");

      // Update brand_profiles table with campaign preferences
      const { error: updateError } = await supabase
        .from("brand_profiles")
        .update({
          campaign_preferences: preferences,
        })
        .eq("id", userId);

      // If record doesn't exist, create it
      if (updateError && updateError.code === "PGRST116") {
        const { error: insertError } = await supabase
          .from("brand_profiles")
          .insert({
            id: userId,
            campaign_preferences: preferences,
          });

        if (insertError) throw insertError;
      } else if (updateError) {
        throw updateError;
      }

      toast({
        title: "Campaign Preferences Updated",
        description: "Your campaign preferences have been saved successfully.",
      });
      
      onSaveSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update campaign preferences",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Preferences</CardTitle>
        <CardDescription>
          Set your preferred collaboration types and content formats for campaigns
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Collaboration Types</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {COLLABORATION_TYPES.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`collab-${type.id}`}
                    checked={preferences.collaboration_types.includes(type.id)}
                    onCheckedChange={() => handleCheckboxChange('collaboration_types', type.id)}
                  />
                  <Label htmlFor={`collab-${type.id}`} className="text-sm">{type.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Content Formats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CONTENT_FORMATS.map((format) => (
                <div key={format.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`format-${format.id}`}
                    checked={preferences.content_formats.includes(format.id)}
                    onCheckedChange={() => handleCheckboxChange('content_formats', format.id)}
                  />
                  <Label htmlFor={`format-${format.id}`} className="text-sm">{format.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="budget">Typical Campaign Budget Range</Label>
            <Select 
              value={preferences.typical_budget} 
              onValueChange={handleBudgetChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a budget range" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_RANGES.map((range) => (
                  <SelectItem key={range.id} value={range.id}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label>Campaign Goals</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {preferences.goals.map((goal) => (
                <Badge key={goal} variant="secondary" className="px-2 py-1 flex items-center gap-1">
                  {goal}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleRemoveGoal(goal)} 
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a campaign goal..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddGoal}
                disabled={!newGoal.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Examples: Brand Awareness, Increased Sales, Social Media Growth, Product Launch
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign-notes">Additional Campaign Requirements</Label>
            <Textarea
              id="campaign-notes"
              value={preferences.notes}
              onChange={handleNotesChange}
              placeholder="Any specific requirements for your campaigns..."
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
