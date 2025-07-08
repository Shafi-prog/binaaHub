// @ts-nocheck
import { createClient } from '@supabase/supabase-js';

export class FileStorageService {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Upload with optimization
  async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: {
      compress?: boolean;
      resize?: { width: number; height: number };
    }
  ) {
    try {
      // Compress/resize if needed
      const processedFile = options?.compress 
        ? await this.compressImage(file, options.resize)
        : file;

      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, processedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  // Generate CDN URLs
  getPublicUrl(bucket: string, path: string) {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }

  // Image optimization
  private async compressImage(
    file: File, 
    resize?: { width: number; height: number }
  ): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        const { width, height } = resize || { width: img.width, height: img.height };
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(new File([blob!], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.8);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // File cleanup for old files
  async cleanupOldFiles(bucket: string, olderThanDays: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const { data: files } = await this.supabase.storage
      .from(bucket)
      .list('', { limit: 1000 });

    if (!files) return;

    const oldFiles = files.filter(file => 
      new Date(file.created_at!) < cutoffDate
    );

    for (const file of oldFiles) {
      await this.supabase.storage
        .from(bucket)
        .remove([file.name]);
    }
  }
}

export const fileStorage = new FileStorageService();


