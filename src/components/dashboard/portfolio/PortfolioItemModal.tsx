
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload, Link, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface PortfolioItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
  userId?: string;
}

export default function PortfolioItemModal({ 
  isOpen, 
  onClose, 
  item, 
  userId 
}: PortfolioItemModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!item;
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [externalLink, setExternalLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens/closes or item changes
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setTitle(item.title || "");
        setDescription(item.description || "");
        setIsFeatured(item.is_featured || false);
        setExternalLink(item.external_link || "");
        setMediaFile(null);
        setMediaPreview(item.media_url || null);
      } else {
        setTitle("");
        setDescription("");
        setIsFeatured(false);
        setMediaFile(null);
        setMediaPreview(null);
        setExternalLink("");
      }
    }
  }, [isOpen, item]);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (!title.trim()) {
      toast({ 
        title: "Title required", 
        description: "Please enter a title for your portfolio item",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      let mediaUrl = item?.media_url || null;
      
      // If there's a new file to upload
      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('portfolio-media')
          .upload(filePath, mediaFile);
        
        if (uploadError) throw uploadError;
        
        mediaUrl = `https://xceitaturyhtqzuoibrd.supabase.co/storage/v1/object/public/portfolio-media/${filePath}`;
      }
      
      const itemData = {
        title,
        description,
        is_featured: isFeatured,
        media_url: mediaUrl,
        external_link: externalLink || null
      };
      
      if (isEditing) {
        const { error } = await supabase
          .from('portfolio_items')
          .update(itemData)
          .eq('id', item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolio_items')
          .insert([{
            ...itemData,
            creator_id: userId
          }]);
        if (error) throw error;
      }
      
      queryClient.invalidateQueries({ queryKey: ['portfolio', userId] });
      
      toast({
        title: isEditing ? "Item updated" : "Item added",
        description: isEditing 
          ? "Your portfolio item has been updated successfully" 
          : "New portfolio item has been added to your collection"
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Portfolio Item" : "Add New Portfolio Item"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Portfolio item title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe this work"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="media">Media Upload</Label>
              <div className="border rounded-md p-2">
                <Input
                  id="media"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className="mb-2"
                />
                
                {mediaPreview && (
                  <div className="mt-2 relative aspect-video bg-muted rounded-md overflow-hidden">
                    {mediaPreview.match(/\.(jpg|jpeg|png|gif|webp)$/i) || mediaPreview.startsWith('data:image/') ? (
                      <img 
                        src={mediaPreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <ImageIcon className="h-10 w-10 text-white opacity-50" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="external_link">External Link</Label>
              <Input
                id="external_link"
                type="url"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">Add a link to the live version of this work</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="featured" 
              checked={isFeatured}
              onCheckedChange={(checked) => setIsFeatured(checked === true)}
            />
            <Label htmlFor="featured" className="cursor-pointer">Mark as featured</Label>
          </div>
            
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
