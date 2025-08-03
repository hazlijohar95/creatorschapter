import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, SkipForward } from "lucide-react";
import { AuthUser } from "@/types/auth";

interface Step1Props {
  user: AuthUser;
  onNext: () => void;
  onSkip?: () => void; // Added skip option
}

export default function Step1Identity({ user, onNext, onSkip }: Step1Props) {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState(user.user_metadata?.full_name || "");
  const [bio, setBio] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const catList = [
    "Beauty", "Fashion", "Fitness", "Tech",
    "Food", "Lifestyle", "Travel", "Music", "Gaming", "Vlog", "Other"
  ];

  // Real-time validation
  const validateField = (field: string, value: string | string[]) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'username':
        if (!value || (typeof value === 'string' && value.trim().length < 3)) {
          newErrors.username = 'Username must be at least 3 characters';
        } else if (typeof value === 'string' && !/^[a-zA-Z0-9_]+$/.test(value)) {
          newErrors.username = 'Username can only contain letters, numbers, and underscores';
        } else {
          delete newErrors.username;
        }
        break;
      case 'fullName':
        if (!value || (typeof value === 'string' && value.trim().length < 2)) {
          newErrors.fullName = 'Full name must be at least 2 characters';
        } else {
          delete newErrors.fullName;
        }
        break;
      default:
        delete newErrors[field];
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isMinimumValid = () => {
    return fullName.trim().length >= 2 && username.trim().length >= 3 && !/[^a-zA-Z0-9_]/.test(username);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only validate minimum required fields
    const usernameValid = validateField('username', username);
    const fullNameValid = validateField('fullName', fullName);
    
    if (!usernameValid || !fullNameValid) {
      toast({ 
        title: "Please fix the errors above", 
        description: "Username and full name are required to continue",
        variant: "destructive" 
      });
      return;
    }
    
    setLoading(true);

    try {
      // Upload photo if provided
      let photoUrl = null;
      if (photo) {
        try {
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
            console.warn("Photo upload failed:", error.message);
            // Don't block onboarding for photo upload failures
          } else {
            // Get the public URL of the uploaded file
            const { data: publicUrlData } = supabase
              .storage
              .from("profile-photos")
              .getPublicUrl(fileName);

            photoUrl = publicUrlData?.publicUrl;
          }
        } catch (photoError) {
          console.warn("Photo upload error:", photoError);
          // Don't block onboarding for photo upload failures
        }
      }

      // Create minimal profile with just the essentials
      const profileData: Record<string, string | string[]> = {
        id: user.id,
        username: username.trim(),
        full_name: fullName.trim(),
        role: 'creator',
        email: user.email || '',
      };

      // Add optional fields only if provided
      if (bio.trim()) {
        profileData.bio = bio.trim();
      }
      if (photoUrl) {
        profileData.avatar_url = photoUrl;
      }

      // Upsert the profile (insert if doesn't exist, update if exists)
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profileData, { onConflict: 'id' });

      // Create creator_profiles entry with categories if provided
      const creatorProfileData: Record<string, any> = {
        id: user.id,
      };

      if (categories.length > 0) {
        creatorProfileData.categories = categories;
      }

      const { error: creatorProfileError } = await supabase
        .from("creator_profiles")
        .upsert(creatorProfileData, { onConflict: 'id' });

      if (profileError || creatorProfileError) {
        throw new Error(profileError?.message || creatorProfileError?.message);
      }

      toast({ 
        title: "Profile saved!", 
        description: "Great! Your basic profile is set up." 
      });
      onNext();
    } catch (error: any) {
      console.error("Profile save error:", error);
      toast({ 
        title: "Save error", 
        description: error.message || "Something went wrong. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!onSkip) return;
    
    // Create minimal profile with just the user's email and ID
    setLoading(true);
    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username: `user_${user.id.slice(0, 8)}`,
          full_name: user.user_metadata?.full_name || `User ${user.id.slice(0, 8)}`,
          role: 'creator',
          email: user.email || '',
        }, { onConflict: 'id' });

      const { error: creatorProfileError } = await supabase
        .from("creator_profiles")
        .upsert({ id: user.id }, { onConflict: 'id' });

      if (profileError || creatorProfileError) {
        throw new Error(profileError?.message || creatorProfileError?.message);
      }

      toast({ 
        title: "Profile created!", 
        description: "You can complete your profile later in settings." 
      });
      onSkip();
    } catch (error: any) {
      console.error("Skip profile error:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Something went wrong.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Simplified intro */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Just the basics!</strong> Only username and full name are required. 
          You can always complete the rest later.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name - Required */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            className={`w-full ${errors.fullName ? 'border-red-500' : ''}`}
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              validateField('fullName', e.target.value);
            }}
            maxLength={100}
            placeholder="Your full name"
          />
          {errors.fullName && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Username - Required */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Username <span className="text-red-500">*</span>
          </label>
          <Input
            className={`w-full ${errors.username ? 'border-red-500' : ''}`}
            value={username}
            onChange={(e) => {
              const cleanValue = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
              setUsername(cleanValue);
              validateField('username', cleanValue);
            }}
            maxLength={32}
            placeholder="yourhandle"
          />
          {errors.username && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.username}
            </p>
          )}
        </div>

        {/* Photo - Optional */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none text-gray-600">
            Profile Photo <span className="text-sm text-gray-400">(optional)</span>
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Bio - Optional */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none text-gray-600">
            Short Bio <span className="text-sm text-gray-400">(optional - 160 chars max)</span>
          </label>
          <Textarea
            className="w-full min-h-[80px]"
            maxLength={160}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a bit about yourself..."
          />
          <p className="text-xs text-gray-400">{bio.length}/160 characters</p>
        </div>

        {/* Categories - Optional */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none text-gray-600">
            Content Categories <span className="text-sm text-gray-400">(optional - pick up to 3)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {catList.map(cat => (
              <button
                type="button"
                key={cat}
                className={`px-3 py-1 rounded-full border transition-colors text-sm ${
                  categories.includes(cat)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-background border-input hover:bg-gray-50"
                }`}
                onClick={() => setCategories(c =>
                  c.includes(cat) 
                    ? c.filter(x => x !== cat) 
                    : c.length < 3 ? [...c, cat] : c
                )}
              >
                {categories.includes(cat) && <CheckCircle className="h-3 w-3 inline mr-1" />}
                {cat}
              </button>
            ))}
          </div>
          {categories.length > 0 && (
            <p className="text-xs text-gray-500">{categories.length}/3 selected</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1"
            disabled={loading || !isMinimumValid()}
          >
            {loading ? "Saving..." : "Continue"}
          </Button>
          
          {onSkip && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <SkipForward className="h-4 w-4" />
              Skip to Dashboard
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}