"use client";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

interface FullscreenToggleProps {
  isFullscreen: boolean;
  onToggle: () => void;
}

export const FullscreenToggle: React.FC<FullscreenToggleProps> = ({
  isFullscreen,
  onToggle,
}) => {
  return (
    <Button variant="outline" onClick={onToggle}>
      {isFullscreen ? (
        <Minimize2 className="w-4 h-4 mr-1" />
      ) : (
        <Maximize2 className="w-4 h-4 mr-1" />
      )}
      {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
    </Button>
  );
};
