import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FolderOpen, Plus, Star, StarOff, Pencil, Trash, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function PortfolioManagement() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [externalLink, setExternalLink] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { data: portfolioItems, refetch } = useQuery({
    queryKey: ["portfolio-items"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("creator_id", user.id)
        .order("is_featured", { ascending: false });
        
      if (error) {
        toast({
          title: "Error fetching portfolio",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data || [];
    },
    enabled: !!user,
  });

  const handlePortfolioUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    let uploadedUrl = null;
    if (media) {
      const { data, error } = await supabase.storage
        .from("portfolio-media")
        .upload(`${user.id}/${media.name}`, media, { upsert: true });
      if (!error) uploadedUrl = data?.path;
      else {
        toast({
          title: "Portfolio Upload Error",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }
    
    const { error } = await supabase.from("portfolio_items").insert([
      {
        creator_id: user.id,
        title,
        description: desc,
        media_url: uploadedUrl,
        external_link: externalLink,
        is_featured: false,
      },
    ]);
    
    setLoading(false);
    if (!error) {
      toast({ title: "Portfolio item added" });
      setTitle("");
      setDesc("");
      setMedia(null);
      setExternalLink("");
      refetch();
    } else {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const toggleFeatured = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from("portfolio_items")
      .update({ is_featured: !currentState })
      .eq("id", id);
      
    if (!error) {
      toast({ 
        title: !currentState 
          ? "Item marked as featured" 
          : "Item removed from featured" 
      });
      refetch();
    } else {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const deleteItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const { error } = await supabase
        .from("portfolio_items")
        .delete()
        .eq("id", id);
        
      if (!error) {
        toast({ title: "Portfolio item deleted" });
        refetch();
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Portfolio</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Portfolio Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Portfolio Item</DialogTitle>
              <DialogDescription>
                Showcase your work by adding a new item to your portfolio.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePortfolioUpload} className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  required
                  placeholder="Enter a title for your portfolio item"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  placeholder="Describe your work (optional)"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="media" className="text-sm font-medium">Upload Media (optional)</label>
                <Input
                  id="media"
                  type="file"
                  onChange={(e) => setMedia(e.target.files?.[0] || null)}
                  accept="image/*,video/*"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="externalLink" className="text-sm font-medium">External Link (optional)</label>
                <Input
                  id="externalLink"
                  placeholder="https://example.com/your-work"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add to Portfolio"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems && portfolioItems.length > 0 ? (
          portfolioItems.map((item: any) => (
            <Card key={item.id} className={item.is_featured ? "border-amber-400 shadow-md" : ""}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => toggleFeatured(item.id, item.is_featured)}
                    >
                      {item.is_featured ? (
                        <Star className="h-4 w-4 text-amber-500" fill="currentColor" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {item.media_url ? (
                    <div className="bg-gray-100 h-36 rounded-md flex items-center justify-center overflow-hidden">
                      <img 
                        src={`${process.env.SUPABASE_URL || 'https://xceitaturyhtqzuoibrd.supabase.co'}/storage/v1/object/public/portfolio-media/${item.media_url}`} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  ) : item.external_link ? (
                    <div className="bg-gray-100 h-36 rounded-md flex items-center justify-center">
                      <Button variant="outline" size="sm" asChild>
                        <a href={item.external_link} target="_blank" rel="noopener noreferrer">
                          <Eye className="mr-2 h-4 w-4" />
                          View External Link
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-gray-100 h-36 rounded-md flex items-center justify-center">
                      <FolderOpen className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  )}
                  
                  {item.is_featured && (
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full self-start">
                      Featured
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border rounded-lg">
            <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No portfolio items yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Add your first portfolio item to showcase your work to potential collaborators.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Portfolio Item</DialogTitle>
                  <DialogDescription>
                    Showcase your work by adding a new item to your portfolio.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePortfolioUpload} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Title</label>
                    <Input
                      id="title"
                      required
                      placeholder="Enter a title for your portfolio item"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Textarea
                      id="description"
                      placeholder="Describe your work (optional)"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="media" className="text-sm font-medium">Upload Media (optional)</label>
                    <Input
                      id="media"
                      type="file"
                      onChange={(e) => setMedia(e.target.files?.[0] || null)}
                      accept="image/*,video/*"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="externalLink" className="text-sm font-medium">External Link (optional)</label>
                    <Input
                      id="externalLink"
                      placeholder="https://example.com/your-work"
                      value={externalLink}
                      onChange={(e) => setExternalLink(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Adding..." : "Add to Portfolio"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
