
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PortfolioItemFormFields } from "./PortfolioItemFormFields";
import { PortfolioItemMediaUpload } from "./PortfolioItemMediaUpload";

interface PortfolioItemFormProps {
  onClose: () => void;
  item?: any;
  userId?: string;
}

export function PortfolioItemForm({ onClose, item, userId }: PortfolioItemFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!item;
  
  const [title, setTitle] = React.useState(item?.title || "");
  const [description, setDescription] = React.useState(item?.description || "");
  const [isFeatured, setIsFeatured] = React.useState(item?.is_featured || false);
  const [mediaPreview, setMediaPreview] = React.useState<string | null>(item?.media_url || null);
  const [externalLink, setExternalLink] = React.useState(item?.external_link || "");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUploadComplete = (url: string) => {
    setMediaPreview(url);
  };

  const handleUploadError = (error: Error) => {
    toast({
      title: "Upload failed",
      description: error.message,
      variant: "destructive"
    });
  };

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
      const itemData = {
        title,
        description,
        is_featured: isFeatured,
        media_url: mediaPreview,
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
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <PortfolioItemFormFields
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        externalLink={externalLink}
        setExternalLink={setExternalLink}
        isFeatured={isFeatured}
        setIsFeatured={setIsFeatured}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PortfolioItemMediaUpload
          mediaPreview={mediaPreview}
          onUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
        />
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
  );
}
