import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { ActionItem } from "./Generic-table";

interface GenericTableActionsProps<T> {
  actions: ActionItem<T>[];
  item: T;
}

export function GenericTableActions<T>({
  item,
  actions,
}: GenericTableActionsProps<T>) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action, index: number) => {
            if (action.render) {
              // render may wrap DropdownMenuItem in DialogTrigger
              return (
                <DropdownMenuItem key={index}>
                  <React.Fragment key={index}>
                    {action.render(item)}
                  </React.Fragment>
                </DropdownMenuItem>
              );
            }

            return (
              <DropdownMenuItem
                key={index}
                disabled={action.disabled?.(item)}
                onSelect={(e) => {
                  if (action.disabled?.(item)) {
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
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
