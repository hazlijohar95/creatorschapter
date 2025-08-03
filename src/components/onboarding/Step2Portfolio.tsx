import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, SkipForward, Plus, X } from "lucide-react";
import { AuthUser } from "@/types/auth";

interface Step2Props {
  user: AuthUser;
  onDone: () => void;
  onSkip?: () => void; // Added skip option
}

export default function Step2Portfolio({ user, onDone, onSkip }: Step2Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [contentFormats, setContentFormats] = useState<string[]>([]);
  const [portfolioItems, setPortfolioItems] = useState([
    { title: "", description: "", url: "", type: "instagram" }
  ]);

  const formatList = [
    "Instagram Posts", "Instagram Stories", "TikTok Videos", "YouTube Videos",
    "YouTube Shorts", "Twitter/X Posts", "LinkedIn Posts", "Blog Posts", "Podcasts", "Live Streams"
  ];

  const addPortfolioItem = () => {
    if (portfolioItems.length < 5) {
      setPortfolioItems([...portfolioItems, { title: "", description: "", url: "", type: "instagram" }]);
    }
  };

  const removePortfolioItem = (index: number) => {
    if (portfolioItems.length > 1) {
      setPortfolioItems(portfolioItems.filter((_, i) => i !== index));
    }
  };

  const updatePortfolioItem = (index: number, field: string, value: string) => {
    const updated = [...portfolioItems];
    updated[index] = { ...updated[index], [field]: value };
    setPortfolioItems(updated);
  };

  const getValidPortfolioItems = () => {
    return portfolioItems.filter(item => 
      item.title.trim() && item.url.trim()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update creator profile with content formats if selected
      if (contentFormats.length > 0) {
        const { error: creatorProfileError } = await supabase
          .from("creator_profiles")
          .upsert({
            id: user.id,
            content_formats: contentFormats,
          }, { onConflict: 'id' });

        if (creatorProfileError) {
          throw new Error(creatorProfileError.message);
        }
      }

      // Add valid portfolio items
      const validItems = getValidPortfolioItems();
      if (validItems.length > 0) {
        const portfolioData = validItems.map(item => ({
          creator_id: user.id,
          title: item.title.trim(),
          description: item.description.trim() || null,
          url: item.url.trim(),
          type: item.type,
        }));

        const { error: portfolioError } = await supabase
          .from("portfolio_items")
          .insert(portfolioData);

        if (portfolioError) {
          console.warn("Portfolio items error:", portfolioError);
          // Don't block completion for portfolio errors
        }
      }

      toast({ 
        title: "Portfolio saved!", 
        description: validItems.length > 0 
          ? `Added ${validItems.length} portfolio item${validItems.length > 1 ? 's' : ''}!`
          : "Profile completed! You can add portfolio items later."
      });
      onDone();
    } catch (error: any) {
      console.error("Portfolio save error:", error);
      toast({ 
        title: "Error saving portfolio", 
        description: error.message || "Something went wrong. You can add items later in your dashboard.", 
        variant: "destructive" 
      });
      // Still proceed to dashboard even if portfolio save fails
      onDone();
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      toast({ 
        title: "Portfolio skipped", 
        description: "You can add portfolio items anytime from your dashboard!" 
      });
      onSkip();
    }
  };

  return (
    <div className="space-y-6">
      {/* Simplified intro */}
      <Alert className="border-green-200 bg-green-50">
        <AlertCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Optional step!</strong> Add your content formats and best work samples, 
          or skip and add them later from your dashboard.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Content Formats - Optional */}
        <div className="space-y-3">
          <label className="text-sm font-medium leading-none">
            Content Formats <span className="text-sm text-gray-400">(optional - what type of content do you create?)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {formatList.map(format => (
              <button
                type="button"
                key={format}
                className={`px-3 py-1 rounded-full border transition-colors text-sm ${
                  contentFormats.includes(format)
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-background border-input hover:bg-gray-50"
                }`}
                onClick={() => setContentFormats(c =>
                  c.includes(format) 
                    ? c.filter(x => x !== format) 
                    : [...c, format]
                )}
              >
                {contentFormats.includes(format) && <CheckCircle className="h-3 w-3 inline mr-1" />}
                {format}
              </button>
            ))}
          </div>
          {contentFormats.length > 0 && (
            <p className="text-xs text-gray-500">{contentFormats.length} format{contentFormats.length > 1 ? 's' : ''} selected</p>
          )}
        </div>

        {/* Portfolio Items - Optional */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none">
              Portfolio Items <span className="text-sm text-gray-400">(optional - show your best work)</span>
            </label>
            {portfolioItems.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPortfolioItem}
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add Item
              </Button>
            )}
          </div>

          {portfolioItems.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Item {index + 1}</h4>
                {portfolioItems.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePortfolioItem(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Input
                    placeholder="Title (e.g., 'Skincare Routine Video')"
                    value={item.title}
                    onChange={(e) => updatePortfolioItem(index, 'title', e.target.value)}
                    maxLength={100}
                  />
                </div>
                <div>
                  <Input
                    placeholder="URL (Instagram, TikTok, YouTube, etc.)"
                    value={item.url}
                    onChange={(e) => updatePortfolioItem(index, 'url', e.target.value)}
                    type="url"
                  />
                </div>
              </div>

              <Textarea
                placeholder="Brief description (optional)"
                value={item.description}
                onChange={(e) => updatePortfolioItem(index, 'description', e.target.value)}
                maxLength={200}
                className="min-h-[60px]"
              />
            </div>
          ))}

          {/* Portfolio Summary */}
          {getValidPortfolioItems().length > 0 && (
            <p className="text-xs text-gray-500">
              {getValidPortfolioItems().length} portfolio item{getValidPortfolioItems().length > 1 ? 's' : ''} ready to save
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1"
            disabled={loading}
          >
            {loading ? "Saving..." : getValidPortfolioItems().length > 0 ? "Save & Continue" : "Complete Setup"}
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