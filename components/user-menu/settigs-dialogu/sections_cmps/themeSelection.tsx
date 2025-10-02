"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette } from "lucide-react";

export default function ThemeSelection() {
  const { theme, setTheme } = useTheme();

  const handleClick = () => {
    // toggle between light and dark
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-between px-6 py-2 m-0"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <Palette className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm font-medium">Theme</span>
      </div>

      {theme === "light" && (
        <Badge variant="outline" className="text-sm text-muted-foreground">
          Light
        </Badge>
      )}

      {theme === "dark" && (
        <Badge variant="outline" className="text-sm text-muted-foreground">
          Dark
        </Badge>
      )}

      {!theme && (
        <Badge variant="outline" className="text-sm text-muted-foreground">
          System
        </Badge>
      )}
    </Button>
  );
}
