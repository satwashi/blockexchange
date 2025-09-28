import { useState, useCallback } from "react";

export function useFilePreview(initialFile: File | null = null) {
  const [file, setFile] = useState<File | null>(initialFile);
  const [preview, setPreview] = useState<string>("");

  const handleFileSelect = useCallback((selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview("");
    }
  }, []);

  const clear = useCallback(() => {
    setFile(null);
    setPreview("");
  }, []);

  return { file, preview, handleFileSelect, clear };
}
