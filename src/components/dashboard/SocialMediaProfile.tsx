import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Trash, Plus } from "lucide-react";

// Type definitions for demographic data
interface TargetAudience {
  age_ranges?: string[];
  interests?: string[];
}

// Country data for location dropdown
const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany", 
  "France", "Japan", "Brazil", "India", "South Africa", "Mexico", "Spain"
];

// Demographic data
const AGE_RANGES = ["13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
const INTERESTS = [
  "Fashion", "Beauty", "Fitness", "Gaming", "Technology", "Travel", 
  "Food", "Music", "Art", "Photography", "Lifestyle", "Finance", "Education"
];

export default function SocialMediaProfile() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  // Social media links state
  const [socialLinks, setSocialLinks] = useState<{id?: string, platform: string, url: string}[]>([]);
  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");
  
  // Location state
  const [location, setLocation] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const filteredCountries = COUNTRIES.filter(country => 
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );
  
  // Demographics state
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // Loading states
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingLinks, setSavingLinks] = useState(false);
  const [savingDemographics, setSavingDemographics] = useState(false);
  
  // Fetch existing data
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['social-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Get profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("location")
        .eq("id", user.id)
        .single();
      
      // Get creator profile data
      const { data: creatorProfile } = await supabase
        .from("creator_profiles")
        .select("target_audience")
        .eq("id", user.id)
        .single();
      
      // Get social links
      const { data: links } = await supabase
        .from("social_links")
        .select("*")
        .eq("profile_id", user.id);
      
      return {
        location: profile?.location || "",
        targetAudience: (creatorProfile?.target_audience as TargetAudience) || { age_ranges: [], interests: [] },
        socialLinks: links || []
      };
    },
    enabled: !!user
  });
  
  // Set initial state from fetched data
  useEffect(() => {
    if (data) {
      setLocation(data.location);
      setSocialLinks(data.socialLinks);
      setSelectedAgeRanges(data.targetAudience.age_ranges || []);
      setSelectedInterests(data.targetAudience.interests || []);
    }
  }, [data]);
  
  // Handle adding a new social media link
  const handleAddSocialLink = async () => {
    if (!user) return;
    if (!newPlatform || !newUrl) {
      toast({
        title: "Missing information",
        description: "Please enter both platform name and URL",
        variant: "destructive"
      });
      return;
    }
    
    // Simple URL validation
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      toast({
        title: "Invalid URL",
        description: "URL must start with http:// or https://",
        variant: "destructive"
      });
      return;
    }
    
    setSavingLinks(true);
    
    // Add new social link
    const { error } = await supabase
      .from("social_links")
      .insert({
        profile_id: user.id,
        platform: newPlatform,
        url: newUrl
      });
    
    setSavingLinks(false);
    
    if (!error) {
      toast({ title: "Social link added" });
      setNewPlatform("");
      setNewUrl("");
      refetch();
    } else {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Handle deleting a social media link
  const handleDeleteSocialLink = async (id: string) => {
    if (!user || !id) return;
    
    setSavingLinks(true);
    
    const { error } = await supabase
      .from("social_links")
      .delete()
      .eq("id", id);
    
    setSavingLinks(false);
    
    if (!error) {
      toast({ title: "Social link removed" });
      refetch();
    } else {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Handle saving location
  const handleSaveLocation = async () => {
    if (!user) return;
    
    setSavingProfile(true);
    
    const { error } = await supabase
      .from("profiles")
      .update({ location })
      .eq("id", user.id);
    
    setSavingProfile(false);
    
    if (!error) {
      toast({ title: "Location updated" });
      refetch();
    } else {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Handle saving demographics
  const handleSaveDemographics = async () => {
    if (!user) return;
    
    setSavingDemographics(true);
    
    const { error } = await supabase
      .from("creator_profiles")
      .update({
        target_audience: {
          age_ranges: selectedAgeRanges,
          interests: selectedInterests
        }
      })
      .eq("id", user.id);
    
    setSavingDemographics(false);
    
    if (!error) {
      toast({ title: "Target audience updated" });
      refetch();
    } else {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Toggle age range selection
  const toggleAgeRange = (ageRange: string) => {
    setSelectedAgeRanges(current => 
      current.includes(ageRange)
        ? current.filter(item => item !== ageRange)
        : [...current, ageRange]
    );
  };
  
  // Toggle interest selection
  const toggleInterest = (interest: string) => {
    setSelectedInterests(current => 
      current.includes(interest)
        ? current.filter(item => item !== interest)
        : [...current, interest]
    );
  };

  if (isLoading) return <div className="flex items-center justify-center p-6"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Social Media Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>
              Add your social media platforms to expand your reach
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {socialLinks.length > 0 ? (
                socialLinks.map(link => (
                  <div key={link.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium">{link.platform}</p>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {link.url}
                      </a>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => link.id && handleDeleteSocialLink(link.id)}
                      disabled={savingLinks}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center border rounded-md bg-muted/50">
                  <p className="text-muted-foreground">No social links added yet</p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  placeholder="Platform (e.g. Instagram)"
                  value={newPlatform}
                  onChange={e => setNewPlatform(e.target.value)}
                />
                <Input
                  placeholder="URL (https://...)"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleAddSocialLink}
                disabled={savingLinks}
              >
                {savingLinks ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Social Link
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>
              Where are you based? This helps match you with local opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Search countries..."
                value={countrySearch}
                onChange={e => setCountrySearch(e.target.value)}
                className="mb-2"
              />
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCountries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSaveLocation} 
              disabled={savingProfile}
              className="w-full"
            >
              {savingProfile ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                "Save Location"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Target Audience Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Target Audience Demographics</CardTitle>
          <CardDescription>
            Define your audience to help match with relevant brand opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Age Ranges</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AGE_RANGES.map(age => (
                <div key={age} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`age-${age}`} 
                    checked={selectedAgeRanges.includes(age)}
                    onCheckedChange={() => toggleAgeRange(age)}
                  />
                  <label 
                    htmlFor={`age-${age}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {age}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Audience Interests</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {INTERESTS.map(interest => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`interest-${interest}`} 
                    checked={selectedInterests.includes(interest)}
                    onCheckedChange={() => toggleInterest(interest)}
                  />
                  <label 
                    htmlFor={`interest-${interest}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveDemographics} 
            disabled={savingDemographics}
            className="w-full"
          >
            {savingDemographics ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              "Save Demographics"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
