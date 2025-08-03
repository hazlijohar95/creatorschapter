
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle, Upload, ExternalLink, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ensurePortfolioStorageBucket } from "@/services/portfolioService";
import { AuthUser } from "@/types/auth";

type ContentFormat = Database["public"]["Enums"]["content_format"];

interface Step2Props {
  user: AuthUser;
  onDone: () => void;
}

export default function Step2Portfolio({ user, onDone }: Step2Props) {
  const { toast } = useToast();

  // State to manage selected formats (multi-select)
  const [formats, setFormats] = useState<ContentFormat[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [externalLink, setExternalLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [formatsSaving, setFormatsSaving] = useState(false);

  // Initialize storage bucket when component loads
  useEffect(() => {
    ensurePortfolioStorageBucket();
  }, []);

  // Define valid content format options using the union type
  const formatOptions: ContentFormat[] = [
    "video",
    "photo",
    "blog",
    "podcast",
    "livestream",
    "story",
  ];

  const toggleFormat = (fmt: ContentFormat) =>
    setFormats((f) => (f.includes(fmt) ? f.filter((v) => v !== fmt) : [...f, fmt]));

  const saveFormats = async () => {
    setFormatsSaving(true);
    const { error } = await supabase
      .from("creator_profiles")
      .update({ content_formats: formats })
      .eq("id", user.id);

    setFormatsSaving(false);
    if (!error) toast({ title: "Formats saved successfully" });
    else
      toast({
        title: "Error saving formats",
        description: error.message,
        variant: "destructive",
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handlePortfolioUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!title.trim()) {
        toast({ 
          title: "Title required", 
          description: "Please enter a title for your portfolio item",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      if (!media && !externalLink) {
        toast({ 
          title: "Media or link required", 
          description: "Please upload media or provide an external link",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      let mediaUrl = null;
      if (media) {
        const fileExt = media.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from("portfolio-media")
          .upload(fileName, media, { upsert: true });
          
        if (error) {
          toast({
            title: "Portfolio Upload Error",
            description: error.message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        mediaUrl = `https://xceitaturyhtqzuoibrd.supabase.co/storage/v1/object/public/portfolio-media/${fileName}`;
      }
      
      const { error } = await supabase.from("portfolio_items").insert([
        {
          creator_id: user.id,
          title,
          description: desc,
          media_url: mediaUrl,
          external_link: externalLink || null,
          is_featured: false,
        },
      ]);
      
      if (!error) {
        toast({ 
          title: "Portfolio item added", 
          description: "Your work has been saved" 
        });
        setTitle("");
        setDesc("");
        setMedia(null);
        setMediaPreview(null);
        setExternalLink("");
        onDone();
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium leading-none mb-2 block">
          Content Formats You Create
          <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {formatOptions.map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => toggleFormat(fmt)}
              className={`px-3 py-1 rounded-full border transition-colors ${
                formats.includes(fmt) 
                  ? "bg-primary text-primary-foreground border-transparent" 
                  : "bg-background border-input hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {formats.includes(fmt) && <CheckCircle className="h-3 w-3 inline mr-1" />}
              {typeof fmt === "string"
                ? fmt.charAt(0).toUpperCase() + fmt.slice(1)
                : fmt}
            </button>
          ))}
        </div>
        <Button
          onClick={saveFormats}
          className="mt-3"
          variant="outline"
          disabled={!formats.length || formatsSaving}
          size="sm"
        >
          {formatsSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            "Save Formats"
          )}
        </Button>
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-2">Portfolio Items <span className="text-sm text-gray-500 font-normal">(at least 1 required)</span></h2>
        
        <form onSubmit={handlePortfolioUpload} className="space-y-4">
          <div>
            <label className="text-sm font-medium leading-none mb-2 block">Title<span className="text-red-500">*</span></label>
            <Input
              required
              placeholder="Portfolio item title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium leading-none mb-2 block">Description</label>
            <Textarea
              placeholder="Briefly describe this work"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium leading-none mb-2 block">
              Upload Media <span className="text-sm text-gray-500">(or provide link below)</span>
            </label>
            <Input
              type="file"
              onChange={handleFileChange}
              accept="image/*,video/*"
            />
            
            {mediaPreview && (
              <div className="mt-2 relative aspect-video bg-muted rounded-md overflow-hidden">
                <img 
                  src={mediaPreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium leading-none mb-2 block flex items-center">
              <ExternalLink className="h-4 w-4 mr-1" /> External Link
            </label>
            <Input
              placeholder="https://..."
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Media upload OR external link required</p>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Adding...
              </>
            ) : (
              "Add Portfolio Item"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
