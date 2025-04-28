
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CampaignBudgetProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function CampaignBudget({ formData, updateFormData }: CampaignBudgetProps) {
  const [locationInput, setLocationInput] = useState("");
  const [nicheInput, setNicheInput] = useState("");
  
  const addLocation = () => {
    if (locationInput.trim() && !formData.audienceRequirements.preferredLocations.includes(locationInput.trim())) {
      updateFormData({
        audienceRequirements: {
          ...formData.audienceRequirements,
          preferredLocations: [...formData.audienceRequirements.preferredLocations, locationInput.trim()]
        }
      });
      setLocationInput("");
    }
  };
  
  const removeLocation = (location: string) => {
    updateFormData({
      audienceRequirements: {
        ...formData.audienceRequirements,
        preferredLocations: formData.audienceRequirements.preferredLocations.filter((l: string) => l !== location)
      }
    });
  };
  
  const addNiche = () => {
    if (nicheInput.trim() && !formData.audienceRequirements.preferredNiches.includes(nicheInput.trim())) {
      updateFormData({
        audienceRequirements: {
          ...formData.audienceRequirements,
          preferredNiches: [...formData.audienceRequirements.preferredNiches, nicheInput.trim()]
        }
      });
      setNicheInput("");
    }
  };
  
  const removeNiche = (niche: string) => {
    updateFormData({
      audienceRequirements: {
        ...formData.audienceRequirements,
        preferredNiches: formData.audienceRequirements.preferredNiches.filter((n: string) => n !== niche)
      }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <Label htmlFor="budget" className="text-base">Campaign Budget</Label>
        <div className="flex items-center space-x-4">
          <span className="text-xl">$</span>
          <Input
            id="budget"
            type="number"
            placeholder="5000"
            value={formData.budget || ""}
            onChange={(e) => updateFormData({ budget: e.target.valueAsNumber || undefined })}
            className="text-lg"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          This is your total campaign budget. You'll be able to allocate it to specific creators later.
        </p>
        
        <div className="bg-muted p-4 rounded-lg space-y-2 mt-2">
          <h4 className="font-medium">Budget Recommendations</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div className="p-2 bg-background rounded border">
              <div className="font-medium">Micro-influencers</div>
              <div className="text-muted-foreground">$200-500 per creator</div>
            </div>
            <div className="p-2 bg-background rounded border">
              <div className="font-medium">Mid-tier influencers</div>
              <div className="text-muted-foreground">$500-2,000 per creator</div>
            </div>
            <div className="p-2 bg-background rounded border">
              <div className="font-medium">Macro-influencers</div>
              <div className="text-muted-foreground">$2,000+ per creator</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label className="text-base">Audience Requirements</Label>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="minFollowers" className="text-sm font-normal text-muted-foreground">
              Minimum Follower Count
            </Label>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>1k</span>
                <span>10k</span>
                <span>50k</span>
                <span>100k</span>
                <span>500k+</span>
              </div>
              <Slider
                defaultValue={[0]}
                max={5}
                step={1}
                value={[formData.audienceRequirements.minFollowers]}
                onValueChange={(value) => {
                  const followerCounts = [0, 1000, 10000, 50000, 100000, 500000];
                  updateFormData({
                    audienceRequirements: {
                      ...formData.audienceRequirements,
                      minFollowers: followerCounts[value[0]]
                    }
                  });
                }}
              />
              <div className="text-center font-medium">
                {formData.audienceRequirements.minFollowers >= 1000 ? (
                  `${formData.audienceRequirements.minFollowers >= 1000000 ? 
                    (formData.audienceRequirements.minFollowers / 1000000).toFixed(1) + 'M' : 
                    (formData.audienceRequirements.minFollowers / 1000).toFixed(0) + 'K'} followers`
                ) : (
                  "No minimum"
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="niches" className="text-sm font-normal text-muted-foreground">
              Preferred Creator Niches
            </Label>
            <div className="flex gap-2">
              <Input
                id="niches"
                placeholder="e.g., Fashion, Travel, Gaming"
                value={nicheInput}
                onChange={(e) => setNicheInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNiche())}
              />
              <Button type="button" onClick={addNiche} variant="secondary">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.audienceRequirements.preferredNiches.map((niche: string, index: number) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {niche}
                  <button 
                    onClick={() => removeNiche(niche)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {formData.audienceRequirements.preferredNiches.length === 0 && (
                <span className="text-sm text-muted-foreground italic">No niches selected</span>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="locations" className="text-sm font-normal text-muted-foreground">
              Preferred Audience Locations
            </Label>
            <div className="flex gap-2">
              <Input
                id="locations"
                placeholder="e.g., United States, Canada, Europe"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
              />
              <Button type="button" onClick={addLocation} variant="secondary">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.audienceRequirements.preferredLocations.map((location: string, index: number) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {location}
                  <button 
                    onClick={() => removeLocation(location)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {formData.audienceRequirements.preferredLocations.length === 0 && (
                <span className="text-sm text-muted-foreground italic">No locations selected</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
