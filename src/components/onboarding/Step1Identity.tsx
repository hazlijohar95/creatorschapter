
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      onNext();
    } else {
      toast({ title: "Save error", description: err1?.message || err2?.message, variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="font-semibold">Username / Handle<span className="text-red-500">*</span></label>
      <input className="input border" required value={username} onChange={e => setUsername(e.target.value.replace(/\s+/g, ""))} maxLength={32} />
      <label className="font-semibold">Profile Photo</label>
      <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} />
      <label className="font-semibold">Short Bio<span className="text-red-500">*</span></label>
      <textarea className="input border" required maxLength={160} value={bio} onChange={e => setBio(e.target.value)} />
      <label className="font-semibold">Main Categories<span className="text-red-500">*</span> <span className="text-xs font-normal">(1-3)</span></label>
      <div className="flex flex-wrap gap-2">
        {catList.map(cat => (
          <button
            type="button"
            key={cat}
            className={`px-3 py-1 rounded-full border ${categories.includes(cat) ? "bg-blue-500 text-white" : ""}`}
            onClick={() => setCategories(c =>
              c.includes(cat) ? c.filter(x => x !== cat) : c.length < 3 ? [...c, cat] : c
            )}
          >{cat}</button>
        ))}
      </div>
      <button type="submit" className="btn-primary py-2 mt-2" disabled={loading}>Next</button>
    </form>
  );
}
