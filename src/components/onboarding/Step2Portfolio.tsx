import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Enums } from "@/integrations/supabase/types";

interface Step2Props {
  user: any;
  onDone: () => void;
}

export default function Step2Portfolio({ user, onDone }: Step2Props) {
  const { toast } = useToast();
  
  const [formats, setFormats] = useState<Enums<'public'>['content_format'][]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [loading, setLoading] = useState(false);

  const formatOptions: Enums<'public'>['content_format'][] = [
    "video", 
    "photo", 
    "blog", 
    "podcast", 
    "livestream", 
    "story"
  ];

  const toggleFormat = (fmt: Enums<'public'>['content_format']) =>
    setFormats(f =>
      f.includes(fmt) ? f.filter(v => v !== fmt) : [...f, fmt]
    );

  const saveFormats = async () => {
    const { error } = await supabase
      .from("creator_profiles")
      .update({ content_formats: formats })
      .eq("id", user.id);
    
    if (!error) toast({ title: "Formats saved" });
    else toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  const handlePortfolioUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let uploadedUrl = null;
    if (media) {
      const { data, error } = await supabase.storage
        .from("portfolio-media")
        .upload(`${user.id}/${media.name}`, media, { upsert: true });
      if (!error) uploadedUrl = data?.path;
      else {
        toast({ title: "Portfolio Upload Error", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
    }
    const { error } = await supabase.from("portfolio_items").insert([{
      creator_id: user.id,
      title,
      description: desc,
      media_url: uploadedUrl,
      external_link: externalLink,
      is_featured: false,
    }]);
    setLoading(false);
    if (!error) {
      toast({ title: "Portfolio saved" });
      setTitle(""); setDesc(""); setMedia(null); setMediaUrl(""); setExternalLink("");
      onDone();
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <label className="font-semibold">Content Formats Produced<span className="text-red-500">*</span></label>
      <div className="flex gap-2 flex-wrap mb-4">
        {formatOptions.map(fmt => (
          <button key={fmt}
            type="button"
            onClick={() => toggleFormat(fmt)}
            className={`px-3 py-1 rounded border ${formats.includes(fmt) ? "bg-blue-500 text-white" : ""}`}>
            {fmt.charAt(0).toUpperCase() + fmt.slice(1)}
          </button>
        ))}
      </div>
      <button onClick={saveFormats} className="btn-secondary mb-6" disabled={!formats.length}>Save Formats</button>

      <hr className="border-dot my-6" />

      <h2 className="font-bold mb-2">Portfolio Items (min 1 required)</h2>
      <form onSubmit={handlePortfolioUpload} className="flex flex-col gap-3">
        <input className="input border" required placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea className="input border" placeholder="Brief Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <input type="file" onChange={e => setMedia(e.target.files?.[0] || null)} accept="image/*,video/*" />
        <input className="input border" placeholder="Or External Link" value={externalLink} onChange={e => setExternalLink(e.target.value)} />
        <button type="submit" className="btn-primary py-2" disabled={loading}>Add Portfolio Item</button>
      </form>
      <div className="mt-4">
        <p className="text-sm text-gray-700">
          Add at least one item. Media upload OR valid link required. You can mark items as featured later in the dashboard.
        </p>
      </div>
    </div>
  );
}
