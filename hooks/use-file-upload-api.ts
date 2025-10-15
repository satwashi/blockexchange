"use client";
import { useState } from "react";
import { toast } from "sonner";

interface UploadResult {
  url: string;
  path: string;
}

export function useFileUploadAPI() {
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
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);
      if (folder) {
        formData.append("folder", folder);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Upload failed with status ${response.status}`
        );
      }

      const result = await response.json();
      setUploadProgress(100);

      return {
        url: result.url,
        path: result.path,
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
