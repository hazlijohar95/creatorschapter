
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { AuthUser } from "@/types/auth";

interface Step1Props {
  user: AuthUser;
  onNext: () => void;
}

export default function Step1Identity({ user, onNext }: Step1Props) {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const catList = [
    "Beauty", "Fashion", "Fitness", "Tech",
    "Food", "Lifestyle", "Travel", "Music", "Gaming", "Vlog", "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast({ title: "Full name is required", variant: "destructive" });
      return;
    }
    if (!username.trim()) {
      toast({ title: "Username is required", variant: "destructive" });
      return;
    }
    if (!bio.trim()) {
      toast({ title: "Bio is required", variant: "destructive" });
      return;
    }
    if (categories.length < 1 || categories.length > 3) {
      toast({ title: "Select 1-3 categories", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      // Upload photo if provided
      let photoUrl = null;
      if (photo) {
        // First, check if the storage bucket exists, if not create it
        const { data: bucketExists } = await supabase
          .storage
          .getBucket('profile-photos');
        
        if (!bucketExists) {
          // Create the bucket if it doesn't exist
          await supabase
            .storage
            .createBucket('profile-photos', {
              public: true,
              fileSizeLimit: 1024 * 1024 * 2 // 2MB
            });
        }
        
        // Upload the file
        const fileExt = photo.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from("profile-photos")
          .upload(fileName, photo, { upsert: true });
          
        if (error) {
          toast({ title: "Photo upload failed", description: error.message, variant: "destructive" });
        } else {
          // Get the public URL of the uploaded file
          const { data: publicUrlData } = supabase
            .storage
            .from("profile-photos")
            .getPublicUrl(fileName);
            
          photoUrl = publicUrlData?.publicUrl;
        }
      }

      // First, ensure the user profile exists (create or update)
      const profileData: Record<string, string | string[]> = {
        username,
        full_name: fullName,
        bio,
        role: 'creator',
        email: user.email || '',
      };
      
      // Only add photo URL if we have one
      if (photoUrl) {
        profileData.avatar_url = photoUrl;
      }

      // Add the ID for upsert
      profileData.id = user.id;

      // Upsert the profile (insert if doesn't exist, update if exists)
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profileData, { onConflict: 'id' });

      // Ensure creator_profiles entry exists (create or update)
      const { error: creatorProfileError } = await supabase
        .from("creator_profiles")
        .upsert(
          { 
            id: user.id, 
            categories 
          }, 
          { onConflict: 'id' }
        );

      if (profileError || creatorProfileError) {
        throw new Error(profileError?.message || creatorProfileError?.message);
      }

      toast({ title: "Profile updated", description: "Basic info saved successfully" });
      onNext();
    } catch (error: any) {
      toast({ title: "Save error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">
          Full Name<span className="text-red-500">*</span>
        </label>
        <Input 
          required 
          className="w-full" 
          value={fullName} 
          onChange={e => setFullName(e.target.value)} 
          maxLength={100} 
          placeholder="Your full name"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">
          Username / Handle<span className="text-red-500">*</span>
        </label>
        <Input 
          required 
          className="w-full" 
          value={username} 
          onChange={e => setUsername(e.target.value.replace(/\s+/g, ""))} 
          maxLength={32} 
          placeholder="yourhandle"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Profile Photo</label>
        <Input 
          type="file" 
          accept="image/*" 
          onChange={e => setPhoto(e.target.files?.[0] || null)}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">
          Short Bio<span className="text-red-500">*</span>
        </label>
        <Textarea 
          required 
          className="w-full min-h-[100px]" 
          maxLength={160} 
          value={bio} 
          onChange={e => setBio(e.target.value)}
          placeholder="Tell us a bit about yourself (max 160 chars)"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">
          Main Categories<span className="text-red-500">*</span> <span className="text-xs text-gray-500">(1-3)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {catList.map(cat => (
            <button
              type="button"
              key={cat}
              className={`px-3 py-1 rounded-full border transition-colors ${
                categories.includes(cat) 
                  ? "bg-primary text-primary-foreground border-transparent" 
                  : "bg-background border-input hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setCategories(c =>
                c.includes(cat) ? c.filter(x => x !== cat) : c.length < 3 ? [...c, cat] : c
              )}
            >
              {categories.includes(cat) && <CheckCircle className="h-3 w-3 inline mr-1" />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full mt-4" 
        disabled={loading}
      >
        {loading ? "Saving..." : "Continue"}
      </Button>
    </form>
  );
}
