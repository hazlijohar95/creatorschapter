import { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth";
import { useCampaignCore } from "@/hooks/campaign";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id?: string;
  name: string;
  description?: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  categories?: string[];
  status?: string;
}

interface CampaignFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Campaign) => void;
  isSubmitting: boolean;
  initialData?: Campaign;
  mode: "create" | "edit";
}

export function CampaignFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialData,
  mode
}: CampaignFormDialogProps) {
  const { user } = useAuthStore();
  const { createCampaign, updateCampaign } = useCampaignCore();
  const { toast } = useToast();
  const [categories, setCategories] = useState<string>(
    initialData?.categories ? initialData.categories.join(", ") : ""
  );

  const form = useForm<Campaign>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      budget: initialData?.budget || undefined,
      start_date: initialData?.start_date || undefined,
      end_date: initialData?.end_date || undefined,
      categories: initialData?.categories || [],
    },
  });

  const handleSubmit = (data: Campaign) => {
    // Parse categories from comma-separated string
    const parsedCategories = categories
      .split(",")
      .map(cat => cat.trim())
      .filter(cat => cat.length > 0);
    
    // Include the campaign ID if we're editing
    const campaignData: Campaign = {
      ...data,
      categories: parsedCategories,
    };
    
    if (initialData?.id) {
      campaignData.id = initialData.id;
    }

    if (mode === "create") {
      createCampaign(campaignData)
        .then(() => {
          toast({
            title: "Campaign created successfully",
            description: "Your campaign has been successfully created.",
          });
        })
        .catch((error) => {
          toast({
            title: "Error creating campaign",
            description: "An error occurred while creating your campaign.",
          });
        });
    } else {
      updateCampaign(campaignData)
        .then(() => {
          toast({
            title: "Campaign updated successfully",
            description: "Your campaign has been successfully updated.",
          });
        })
        .catch((error) => {
          toast({
            title: "Error updating campaign",
            description: "An error occurred while updating your campaign.",
          });
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Campaign" : "Edit Campaign"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Summer Collection Launch" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Campaign objectives and details..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5000"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Fashion, Beauty, Lifestyle"
                    value={categories}
                    onChange={(e) => setCategories(e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  Separate categories with commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : mode === "create" ? "Create Campaign" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
