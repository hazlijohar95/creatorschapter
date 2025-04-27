
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export async function uploadFile(
  file: File,
  userId: string,
  options?: { 
    bucket?: string;
    isPublic?: boolean;
  }
) {
  const bucket = options?.bucket || 'portfolio-media';
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        upsert: true,
        cacheControl: options?.isPublic ? '3600' : '0',
      });

    if (error) throw error;

    // Get public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { url: publicUrl, path: fileName };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function deleteFile(path: string, bucket: string = 'portfolio-media') {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

export function useFileUpload() {
  const { toast } = useToast();

  const uploadFileWithProgress = async (
    file: File,
    userId: string,
    options?: {
      bucket?: string;
      isPublic?: boolean;
      onProgress?: (progress: number) => void;
    }
  ) => {
    try {
      const result = await uploadFile(file, userId, options);
      toast({
        title: "File uploaded successfully",
        description: "Your file has been uploaded and is ready to use.",
      });
      return result;
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your file.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { uploadFileWithProgress };
}
