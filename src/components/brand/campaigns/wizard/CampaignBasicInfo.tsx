
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";

interface CampaignBasicInfoProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function CampaignBasicInfo({ formData, updateFormData }: CampaignBasicInfoProps) {
  const [categoryInput, setCategoryInput] = useState("");

  const addCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      updateFormData({
        categories: [...formData.categories, categoryInput.trim()]
      });
      setCategoryInput("");
    }
  };

  const removeCategory = (category: string) => {
    updateFormData({
      categories: formData.categories.filter((c: string) => c !== category)
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="name">Campaign Name</Label>
        <Input
          id="name"
          placeholder="Summer Collection Launch"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
        />
        <p className="text-sm text-muted-foreground">
          Choose a clear, descriptive name for your campaign
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Campaign Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your campaign goals, brand values, and what you're looking for..."
          className="min-h-[100px]"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Campaign Dates</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start-date" className="text-sm font-normal text-muted-foreground mb-1 block">
              Start Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.start_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.start_date ? (
                    format(new Date(formData.start_date), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.start_date ? new Date(formData.start_date) : undefined}
                  onSelect={(date) => updateFormData({ start_date: date ? date.toISOString() : "" })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label htmlFor="end-date" className="text-sm font-normal text-muted-foreground mb-1 block">
              End Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.end_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.end_date ? (
                    format(new Date(formData.end_date), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.end_date ? new Date(formData.end_date) : undefined}
                  onSelect={(date) => updateFormData({ end_date: date ? date.toISOString() : "" })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="categories">Campaign Categories</Label>
        <div className="flex gap-2">
          <Input
            id="categories"
            placeholder="Fashion, Beauty, Lifestyle..."
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
          />
          <Button type="button" onClick={addCategory} variant="secondary">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.categories.map((category: string) => (
            <Badge key={category} variant="secondary" className="px-3 py-1 text-sm">
              {category}
              <button 
                onClick={() => removeCategory(category)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
