"use client";
import { useState } from "react";
import { createClient } from "@/lib/client";
import { toast } from "sonner";

interface UploadResult {
  url: string;
  path: string;
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (
    file: File,
    bucket: string = "kyc_documents",
    folder?: string
  ): Promise<UploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const supabase = createClient();

      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      const fileName = folder
        ? `${folder}/${timestamp}_${file.name}`
        : `${timestamp}_${file.name}`;

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setUploadProgress(100);

      return {
        url: urlData.publicUrl,
        path: data.path,
      };
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to upload file. Please try again.");
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadMultipleFiles = async (
    files: File[],
    bucket: string = "kyc_documents",
    folder?: string
  ): Promise<UploadResult[]> => {
    setIsUploading(true);
    const results: UploadResult[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress((i / files.length) * 100);

        const result = await uploadFile(file, bucket, folder);
        results.push(result);
      }

      setUploadProgress(100);
      return results;
    } catch (error) {
      console.error("Multiple file upload error:", error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    uploadProgress,
  };
}
