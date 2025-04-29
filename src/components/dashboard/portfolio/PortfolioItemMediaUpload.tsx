
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";
import { FileUpload } from "@/components/shared/FileUpload";

interface PortfolioItemMediaUploadProps {
  mediaPreview: string | null;
  onUploadComplete: (url: string) => void;
  onUploadError: (error: Error) => void;
}

export function PortfolioItemMediaUpload({
  mediaPreview,
  onUploadComplete,
  onUploadError
}: PortfolioItemMediaUploadProps) {
  const [isImageLoading, setIsImageLoading] = useState(Boolean(mediaPreview));
  
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="media">Media Upload</Label>
      <div className="border rounded-md p-2">
        <FileUpload
          onUploadComplete={onUploadComplete}
          onError={onUploadError}
          accept="image/*,video/*"
          buttonText="Upload Media"
        />
      
        {mediaPreview && (
          <div className="mt-2 relative aspect-video bg-muted rounded-md overflow-hidden">
            {mediaPreview.match(/\.(jpg|jpeg|png|gif|webp)$/i) || mediaPreview.startsWith('data:image/') ? (
              <>
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img 
                  src={mediaPreview} 
                  alt="Preview" 
                  className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={handleImageLoad}
                  loading="lazy"
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <ImageIcon className="h-10 w-10 text-white opacity-50" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
