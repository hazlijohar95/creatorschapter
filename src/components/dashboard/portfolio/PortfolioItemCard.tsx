
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Star, ExternalLink, Eye, Image, Video } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PortfolioItemCardProps {
  item: {
    id: string;
    title: string;
    description?: string | null;
    media_url?: string | null;
    external_link?: string | null;
    view_count?: number | null;
    is_featured?: boolean | null;
    created_at?: string | null;
  };
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
}

export default function PortfolioItemCard({ 
  item, 
  onEdit, 
  onDelete, 
  onToggleFeatured 
}: PortfolioItemCardProps) {
  const isImage = item.media_url && /\.(jpg|jpeg|png|gif|webp)$/i.test(item.media_url);
  const isVideo = item.media_url && /\.(mp4|webm|mov|avi)$/i.test(item.media_url);
  
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      {/* Media preview */}
      <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img 
            src={item.media_url} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
        ) : isVideo ? (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <Video className="h-12 w-12 text-white opacity-70" />
          </div>
        ) : item.external_link ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
            <ExternalLink className="h-12 w-12 text-blue-400" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Image className="h-12 w-12 text-muted-foreground opacity-30" />
          </div>
        )}
        
        {item.is_featured && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white rounded-full p-1">
            <Star className="h-4 w-4 fill-current" />
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
        </div>
        
        {item.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {item.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            {item.view_count || 0} views
          </div>
          {item.created_at && (
            <div>• Added {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 border-t mt-auto">
        <div className="flex gap-2 w-full justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleFeatured}
            className={item.is_featured ? "text-yellow-500" : ""}
          >
            <Star className={`h-4 w-4 ${item.is_featured ? "fill-yellow-500" : ""}`} />
          </Button>
          
          <div className="flex gap-2">
            {item.external_link && (
              <Button variant="outline" size="sm" asChild>
                <a href={item.external_link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
