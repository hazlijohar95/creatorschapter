
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CampaignRequirementsProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function CampaignRequirements({ formData, updateFormData }: CampaignRequirementsProps) {
  const [deliverableInput, setDeliverableInput] = useState("");
  
  const contentFormats = [
    { id: "instagram-post", label: "Instagram Post" },
    { id: "instagram-story", label: "Instagram Story" },
    { id: "instagram-reel", label: "Instagram Reel" },
    { id: "tiktok", label: "TikTok Video" },
    { id: "youtube-short", label: "YouTube Short" },
    { id: "youtube-video", label: "YouTube Video" },
    { id: "blog-post", label: "Blog Post" },
    { id: "twitter-post", label: "Twitter Post" },
    { id: "facebook-post", label: "Facebook Post" },
  ];
  
  const toggleFormat = (format: string) => {
    const currentFormats = formData.contentRequirements.formats;
    if (currentFormats.includes(format)) {
      updateFormData({
        contentRequirements: {
          ...formData.contentRequirements,
          formats: currentFormats.filter((f: string) => f !== format)
        }
      });
    } else {
      updateFormData({
        contentRequirements: {
          ...formData.contentRequirements,
          formats: [...currentFormats, format]
        }
      });
    }
  };
  
  const addDeliverable = () => {
    if (deliverableInput.trim() && !formData.contentRequirements.deliverables.includes(deliverableInput.trim())) {
      updateFormData({
        contentRequirements: {
          ...formData.contentRequirements,
          deliverables: [...formData.contentRequirements.deliverables, deliverableInput.trim()]
        }
      });
      setDeliverableInput("");
    }
  };
  
  const removeDeliverable = (deliverable: string) => {
    updateFormData({
      contentRequirements: {
        ...formData.contentRequirements,
        deliverables: formData.contentRequirements.deliverables.filter((d: string) => d !== deliverable)
      }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <Label className="text-base">Content Formats</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Select all the content formats you want creators to produce
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contentFormats.map((format) => (
            <div key={format.id} className="flex items-center space-x-2">
              <Checkbox
                id={format.id}
                checked={formData.contentRequirements.formats.includes(format.id)}
                onCheckedChange={() => toggleFormat(format.id)}
              />
              <label
                htmlFor={format.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {format.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <Label className="text-base">Required Deliverables</Label>
        <p className="text-sm text-muted-foreground">
          Add specific items that creators must deliver for this campaign
        </p>
        
        <div className="flex gap-2">
          <Input
            placeholder="e.g., 3 Instagram Stories with product close-ups"
            value={deliverableInput}
            onChange={(e) => setDeliverableInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDeliverable())}
          />
          <Button type="button" onClick={addDeliverable} variant="secondary">
            Add
          </Button>
        </div>
        
        <div className="space-y-2 mt-2">
          {formData.contentRequirements.deliverables.length > 0 ? (
            <ul className="space-y-2">
              {formData.contentRequirements.deliverables.map((deliverable: string, index: number) => (
                <li key={index} className="flex items-center justify-between p-2 rounded-md border bg-background">
                  <span className="text-sm">{deliverable}</span>
                  <button 
                    onClick={() => removeDeliverable(deliverable)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-muted-foreground italic">
              No deliverables added yet
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="guidelines">Content Guidelines</Label>
        <Textarea
          id="guidelines"
          placeholder="Provide specific instructions, style guidelines, dos and don'ts for creators..."
          className="min-h-[150px]"
          value={formData.contentRequirements.guidelines}
          onChange={(e) => updateFormData({
            contentRequirements: {
              ...formData.contentRequirements,
              guidelines: e.target.value
            }
          })}
        />
        <p className="text-sm text-muted-foreground">
          Clear guidelines help creators understand exactly what you're looking for
        </p>
      </div>
    </div>
  );
}
