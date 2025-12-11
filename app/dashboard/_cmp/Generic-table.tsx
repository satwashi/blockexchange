"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GenericTableActions } from "./GenericTableActions";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

export type ActionItem<T> = {
  label?: string;
  icon?: React.ReactNode;
  onClick?: (item: T) => void;
  confirm?: string;
  disabled?: (item: T) => boolean;
  render?: (item: T) => React.ReactNode;
};

export interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: (item: T) => ActionItem<T>[];
  modals?: (item: T) => ModalItem<T>[];
}

export type ModalItem<T> = {
  render: (item: T) => React.ReactNode;
};

// Empty State Component
function EmptyState({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-48">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground font-medium">No data available</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Records will appear here once created
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function GenericTable<T extends { id: string }>({
  data,
  columns,
  actions,
}: GenericTableProps<T>) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className="h-12 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/30 whitespace-nowrap"
                >
                  {column.label}
                </TableHead>
              ))}
              {actions && (
                <TableHead className="w-[60px] bg-muted/30 sticky right-0">
                  <span className="sr-only">Actions</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <EmptyState colSpan={columns.length + (actions ? 1 : 0)} />
            ) : (
              data.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={cn(
                    "border-border/50 transition-colors",
                    "hover:bg-accent/30",
                    index % 2 === 0 ? "bg-transparent" : "bg-muted/10"
                  )}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className="px-4 py-3.5 text-sm whitespace-nowrap"
                    >
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] ?? "-")}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="px-4 py-3.5 sticky right-0 bg-card/95 backdrop-blur-sm">
                      <GenericTableActions actions={actions(item)} item={item} />
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
