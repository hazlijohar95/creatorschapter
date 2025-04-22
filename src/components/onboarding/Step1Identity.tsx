
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface Step1Props {
  user: any;
  onNext: () => void;
}

export default function Step1Identity({ user, onNext }: Step1Props) {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
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
    if (categories.length < 1 || categories.length > 3) {
      toast({ title: "Select 1-3 categories", variant: "destructive" });
      return;
    }
    setLoading(true);

    // Upload photo if provided
    let photoUrl = null;
    if (photo) {
      const { data, error } = await supabase.storage
        .from("profile-photos")
        .upload(`${user.id}/${photo.name}`, photo, { upsert: true });
      if (error) {
        toast({ title: "Photo upload failed", description: error.message, variant: "destructive" });
      } else {
        photoUrl = data?.path;
      }
    }

    // Save to profiles & creator_profiles
    const { error: err1 } = await supabase
      .from("profiles")
      .update({ username, bio, photo_url: photoUrl })
      .eq("id", user.id);
    const { error: err2 } = await supabase
      .from("creator_profiles")
      .update({ categories })
      .eq("id", user.id);

    setLoading(false);
    if (!err1 && !err2) {
      toast({ title: "Profile updated", description: "Basic info saved successfully" });
      onNext();
    } else {
      toast({ title: "Save error", description: err1?.message || err2?.message, variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
