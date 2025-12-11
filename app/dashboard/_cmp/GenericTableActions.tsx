import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ActionItem } from "./Generic-table";
import { cn } from "@/lib/utils";

interface GenericTableActionsProps<T> {
  actions: ActionItem<T>[];
  item: T;
}

export function GenericTableActions<T>({
  item,
  actions,
}: GenericTableActionsProps<T>) {
  if (actions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
          aria-label="Actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 rounded-xl border-border/50 bg-popover/95 backdrop-blur-md shadow-xl"
      >
        {actions.map((action, index) => {
          // Add separator before last item if there are multiple items
          const showSeparator = index === actions.length - 1 && actions.length > 1;

          if (action.render) {
            return (
              <React.Fragment key={index}>
                {showSeparator && <DropdownMenuSeparator className="bg-border/50" />}
                <DropdownMenuItem
                  className="rounded-lg cursor-pointer focus:bg-accent/50"
                >
                  {action.render(item)}
                </DropdownMenuItem>
              </React.Fragment>
            );
          }

          const isDisabled = action.disabled?.(item);

          return (
            <React.Fragment key={index}>
              {showSeparator && <DropdownMenuSeparator className="bg-border/50" />}
              <DropdownMenuItem
                disabled={isDisabled}
                onSelect={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                    return;
                  }
                  if (action.confirm) {
                    e.preventDefault();
                    if (window.confirm(action.confirm)) {
                      action.onClick?.(item);
                    }
                  } else {
                    action.onClick?.(item);
                  }
                }}
                className={cn(
                  "rounded-lg cursor-pointer transition-colors",
                  "focus:bg-accent/50",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {action.icon && (
                  <span className="mr-2 text-muted-foreground">{action.icon}</span>
                )}
                <span className="text-sm">{action.label}</span>
              </DropdownMenuItem>
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
