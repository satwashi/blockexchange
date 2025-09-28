import { useState, useCallback } from "react";

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");

  const openModal = useCallback((url: string, modalTitle: string) => {
    setImageUrl(url);
    setTitle(modalTitle);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsOpen(false), []);

  return { isOpen, imageUrl, title, openModal, closeModal };
}
