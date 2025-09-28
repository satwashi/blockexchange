import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export const PreviewModal = ({
  isOpen,
  onClose,
  imageUrl,
  title,
}: PreviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {title}
            {/* <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button> */}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
