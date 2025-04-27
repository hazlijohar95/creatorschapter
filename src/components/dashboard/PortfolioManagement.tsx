
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, FolderOpen, Star, ExternalLink, Eye } from "lucide-react";
import PortfolioItemCard from "./portfolio/PortfolioItemCard";
import PortfolioItemModal from "./portfolio/PortfolioItemModal";
import { useToast } from "@/hooks/use-toast";

export default function PortfolioManagement() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch portfolio items
  const { data: portfolio = [], isLoading } = useQuery({
    queryKey: ["portfolio", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("id, title, description, media_url, external_link, view_count, is_featured, created_at")
        .eq("creator_id", user.id)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("portfolio_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", user?.id] });
      toast({
        title: "Item deleted",
        description: "Portfolio item has been removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Feature mutation
  const featureMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase
        .from("portfolio_items")
        .update({ is_featured: featured })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio", user?.id] });
      toast({
        title: "Portfolio updated",
        description: "Featured status has been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const toggleFeatured = (id: string, currentStatus: boolean) => {
    featureMutation.mutate({ id, featured: !currentStatus });
  };

  // Filter portfolio items based on active tab
  const filteredPortfolio = portfolio.filter((item: any) => {
    if (activeTab === "all") return true;
    if (activeTab === "featured") return item.is_featured;
    
    // Check if media_url contains expected file extensions for images or videos
    const mediaUrl = item.media_url || "";
    if (activeTab === "images") {
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(mediaUrl);
    }
    if (activeTab === "videos") {
      return /\.(mp4|webm|mov|avi)$/i.test(mediaUrl);
    }
    if (activeTab === "links") {
      return item.external_link && !item.media_url;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Portfolio</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={16} /> Add New Item
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Portfolio Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-md p-4 border">
              <div className="text-2xl font-bold">{portfolio.length}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="bg-card rounded-md p-4 border">
              <div className="text-2xl font-bold">
                {portfolio.reduce((sum: number, item: any) => sum + (item.view_count || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
            <div className="bg-card rounded-md p-4 border">
              <div className="text-2xl font-bold">
                {portfolio.filter((item: any) => item.is_featured).length}
              </div>
              <div className="text-sm text-muted-foreground">Featured Items</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredPortfolio.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPortfolio.map((item: any) => (
                  <PortfolioItemCard 
                    key={item.id}
                    item={item}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                    onToggleFeatured={() => toggleFeatured(item.id, item.is_featured)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<FolderOpen className="h-12 w-12 opacity-20" />}
                title="No portfolio items found"
                description={activeTab === "all" ? "Add your first portfolio item to showcase your work" : "No items match the selected filter"}
                action={{
                  label: "Add Item",
                  onClick: handleAddNew,
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <PortfolioItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={editingItem}
        userId={user?.id}
      />
    </div>
  );
}
