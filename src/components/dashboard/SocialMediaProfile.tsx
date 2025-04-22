import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { validateSocialUrl, ensureHttps } from "@/lib/socialMediaValidation";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Save } from "lucide-react";
import { TargetAudience } from "@/types/profiles";

const formSchema = z.object({
  instagram: z.string().optional()
    .refine(url => !url || validateSocialUrl(url, 'instagram').valid, {
      message: "Please enter a valid Instagram URL",
    }),
  twitter: z.string().optional()
    .refine(url => !url || validateSocialUrl(url, 'twitter').valid, {
      message: "Please enter a valid Twitter/X URL",
    }),
  youtube: z.string().optional()
    .refine(url => !url || validateSocialUrl(url, 'youtube').valid, {
      message: "Please enter a valid YouTube URL",
    }),
  tiktok: z.string().optional()
    .refine(url => !url || validateSocialUrl(url, 'tiktok').valid, {
      message: "Please enter a valid TikTok URL",
    }),
  country: z.string().min(1, "Please select a country"),
  city: z.string().min(1, "Please enter your city"),
  ageGroup: z.string().min(1, "Please select an age group"),
  gender: z.string().min(1, "Please select a gender"),
  interests: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function SocialMediaProfile() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instagram: "",
      twitter: "",
      youtube: "",
      tiktok: "",
      country: "",
      city: "",
      ageGroup: "",
      gender: "",
      interests: ""
    },
  });

  useEffect(() => {
    async function loadSocialData() {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data: creatorData, error: creatorError } = await supabase
          .from("creator_profiles")
          .select("target_audience")
          .eq("id", user.id)
          .maybeSingle();
          
        if (creatorError) throw creatorError;
        
        const { data: socialLinksData, error: socialLinksError } = await supabase
          .from("social_links")
          .select("platform, url")
          .eq("profile_id", user.id);
          
        if (socialLinksError) throw socialLinksError;
        
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("location")
          .eq("id", user.id)
          .maybeSingle();
          
        if (profileError) throw profileError;
        
        const socialLinks: Record<string, string> = {};
        socialLinksData?.forEach((link) => {
          socialLinks[link.platform] = link.url;
        });
        
        let targetAudience: TargetAudience = {};
        if (creatorData?.target_audience) {
          if (typeof creatorData.target_audience === 'object' && creatorData.target_audience !== null) {
            targetAudience = creatorData.target_audience as TargetAudience;
          }
        }
        
        let location = { country: '', city: '' };
        if (profileData?.location) {
          try {
            if (typeof profileData.location === 'string') {
              location = JSON.parse(profileData.location);
            } else if (typeof profileData.location === 'object') {
              location = profileData.location as { country: string; city: string };
            }
          } catch (e) {
            console.error("Error parsing location data:", e);
          }
        }
        
        form.reset({
          instagram: socialLinks.instagram || "",
          twitter: socialLinks.twitter || "",
          youtube: socialLinks.youtube || "",
          tiktok: socialLinks.tiktok || "",
          country: location.country || "",
          city: location.city || "",
          ageGroup: targetAudience.age_group || "",
          gender: targetAudience.gender || "",
          interests: Array.isArray(targetAudience.interests) ? targetAudience.interests.join(", ") : ""
        });
      } catch (error) {
        console.error("Error loading social data:", error);
        toast({
          title: "Failed to load your profile data",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        setInitialDataLoaded(true);
      }
    }
    
    loadSocialData();
  }, [user, form, toast]);
  
  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const location = {
        country: values.country,
        city: values.city,
      };
      
      const targetAudience: TargetAudience = {
        age_group: values.ageGroup,
        gender: values.gender,
        interests: values.interests ? values.interests.split(",").map(item => item.trim()) : [],
      };
      
      const { error: creatorError } = await supabase
        .from("creator_profiles")
        .update({
          target_audience: targetAudience,
        })
        .eq("id", user.id);
      
      if (creatorError) throw creatorError;
      
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          location: JSON.stringify(location),
        })
        .eq("id", user.id);
        
      if (profileError) throw profileError;
      
      const { error: deleteError } = await supabase
        .from("social_links")
        .delete()
        .eq("profile_id", user.id);
        
      if (deleteError) throw deleteError;
      
      const socialLinksToInsert = [
        { platform: 'instagram', url: ensureHttps(values.instagram || ""), profile_id: user.id },
        { platform: 'twitter', url: ensureHttps(values.twitter || ""), profile_id: user.id },
        { platform: 'youtube', url: ensureHttps(values.youtube || ""), profile_id: user.id },
        { platform: 'tiktok', url: ensureHttps(values.tiktok || ""), profile_id: user.id },
      ].filter(link => link.url);
      
      if (socialLinksToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from("social_links")
          .insert(socialLinksToInsert);
          
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Profile updated",
        description: "Your social media profile has been saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving social data:", error);
      toast({
        title: "Update failed",
        description: error.message || "There was a problem updating your profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-muted-foreground">Social Media & Audience</h1>
          <Button 
            type="submit" 
            disabled={isLoading || !initialDataLoaded}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Profile
              </>
            )}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="instagram.com/yourusername" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          const result = validateSocialUrl(e.target.value, 'instagram');
                          if (e.target.value && !result.valid) {
                            form.setError("instagram", { 
                              message: result.message 
                            });
                          } else {
                            form.clearErrors("instagram");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Twitter/X</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="twitter.com/yourusername" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          const result = validateSocialUrl(e.target.value, 'twitter');
                          if (e.target.value && !result.valid) {
                            form.setError("twitter", { 
                              message: result.message 
                            });
                          } else {
                            form.clearErrors("twitter");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="youtube"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>YouTube</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="youtube.com/c/yourchannel" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          const result = validateSocialUrl(e.target.value, 'youtube');
                          if (e.target.value && !result.valid) {
                            form.setError("youtube", { 
                              message: result.message 
                            });
                          } else {
                            form.clearErrors("youtube");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tiktok"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>TikTok</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="tiktok.com/@yourusername" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          const result = validateSocialUrl(e.target.value, 'tiktok');
                          if (e.target.value && !result.valid) {
                            form.setError("tiktok", { 
                              message: result.message 
                            });
                          } else {
                            form.clearErrors("tiktok");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Country</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="canada">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="australia">Australia</SelectItem>
                        <SelectItem value="germany">Germany</SelectItem>
                        <SelectItem value="france">France</SelectItem>
                        <SelectItem value="japan">Japan</SelectItem>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="brazil">Brazil</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input id="city" placeholder="Your city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Target Audience Demographics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="ageGroup"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Age Group</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select age group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="13-17">13-17</SelectItem>
                          <SelectItem value="18-24">18-24</SelectItem>
                          <SelectItem value="25-34">25-34</SelectItem>
                          <SelectItem value="35-44">35-44</SelectItem>
                          <SelectItem value="45+">45+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Gender</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="all">All Genders</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Interests (comma separated)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., fitness, travel, tech" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end">
          {form.formState.isDirty && !isLoading && (
            <div className="flex items-center text-amber-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              You have unsaved changes
            </div>
          )}
          
          {form.formState.isSubmitSuccessful && !form.formState.isDirty && (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              All changes saved
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
