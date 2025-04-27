
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PortfolioItemFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  externalLink: string;
  setExternalLink: (value: string) => void;
  isFeatured: boolean;
  setIsFeatured: (value: boolean) => void;
}

export function PortfolioItemFormFields({
  title,
  setTitle,
  description,
  setDescription,
  externalLink,
  setExternalLink,
  isFeatured,
  setIsFeatured
}: PortfolioItemFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
        <Input 
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Portfolio item title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Briefly describe this work"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="external_link">External Link</Label>
        <Input
          id="external_link"
          type="url"
          value={externalLink}
          onChange={(e) => setExternalLink(e.target.value)}
          placeholder="https://..."
        />
        <p className="text-xs text-muted-foreground">Add a link to the live version of this work</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="featured" 
          checked={isFeatured}
          onCheckedChange={(checked) => setIsFeatured(checked === true)}
        />
        <Label htmlFor="featured" className="cursor-pointer">Mark as featured</Label>
      </div>
    </div>
  );
}
