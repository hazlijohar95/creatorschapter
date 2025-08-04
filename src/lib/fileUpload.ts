import { supabase } from "@/integrations/supabase/client";
import { logger } from "./logger";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  archives: ['application/zip', 'application/x-rar-compressed']
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size must be less than 10MB" };
  }

  // Check file type
  const allAllowedTypes = [
    ...ALLOWED_FILE_TYPES.images,
    ...ALLOWED_FILE_TYPES.documents,
    ...ALLOWED_FILE_TYPES.archives
  ];

  if (!allAllowedTypes.includes(file.type)) {
    return { valid: false, error: "File type not supported" };
  }

  return { valid: true };
}

export async function uploadFile(
  file: File,
  bucket: string = 'message-attachments',
  userId?: string
): Promise<UploadResult> {
  try {
    // Validate file first
    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId || 'anonymous'}_${timestamp}_${randomString}.${fileExtension}`;

    logger.info('Starting file upload', { 
      fileName, 
      fileSize: file.size, 
      fileType: file.type 
    });

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      logger.error('File upload failed', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    logger.info('File uploaded successfully', { 
      fileName, 
      publicUrl: urlData.publicUrl 
    });

    return { 
      success: true, 
      url: urlData.publicUrl 
    };

  } catch (error: any) {
    logger.error('Unexpected error during file upload', error);
    return { 
      success: false, 
      error: error.message || 'Upload failed' 
    };
  }
}

export function getFileIcon(fileType: string): string {
  if (ALLOWED_FILE_TYPES.images.includes(fileType)) {
    return "🖼️";
  }
  if (ALLOWED_FILE_TYPES.documents.includes(fileType)) {
    return "📄";
  }
  if (ALLOWED_FILE_TYPES.archives.includes(fileType)) {
    return "🗂️";
  }
  return "📎";
}