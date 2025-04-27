
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useFileUpload } from "@/lib/storage";
import { useAuthStore } from "@/lib/auth";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  onError?: (error: Error) => void;
  accept?: string;
  buttonText?: string;
  loading?: boolean;
}

export function FileUpload({
  onUploadComplete,
  onError,
  accept = "image/*",
  buttonText = "Upload File",
  loading = false
}: FileUploadProps) {
  const { user } = useAuthStore();
  const { uploadFileWithProgress } = useFileUpload();
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const { url } = await uploadFileWithProgress(file, user.id, {
        isPublic: true,
      });
      onUploadComplete(url);
    } catch (error: any) {
      onError?.(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        disabled={isUploading || loading}
        className="relative"
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            {buttonText}
          </>
        )}
      </Button>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
        onClick={(e) => (e.currentTarget.value = '')}
      />
    </div>
  );
}
