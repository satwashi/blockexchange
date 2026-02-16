import imageCompression from "browser-image-compression";

/**
 * Compresses an image file to a target size (default < 1MB)
 * while maintaining reasonable quality for documents/KYC.
 */
export async function compressImage(
  file: File,
  options?: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    initialQuality?: number;
  }
): Promise<File> {
  // Default options for document/KYC photos
  const defaultOptions = {
    maxSizeMB: 1, // Target file size < 1MB
    maxWidthOrHeight: 1920, // Max dimension (HD is enough for docs)
    useWebWorker: true,
    initialQuality: 0.8, // Start with reasonable quality
    fileType: file.type as string, // Preserve original type
  };

  const compressionOptions = { ...defaultOptions, ...options };

  try {
    // Only compress if it's an image
    if (!file.type.startsWith("image/")) {
      return file;
    }

    console.log(
      `Compressing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`
    );

    const compressedFile = await imageCompression(file, compressionOptions);

    console.log(
      `Compressed ${file.name} to ${(
        compressedFile.size /
        1024 /
        1024
      ).toFixed(2)} MB`
    );

    return compressedFile;
  } catch (error) {
    console.error("Image compression failed:", error);
    // Return original file if compression fails ensuring flow doesn't break
    return file;
  }
}
