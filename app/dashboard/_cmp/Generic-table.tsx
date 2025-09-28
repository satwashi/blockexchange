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

export default function GenericTable<T extends { id: string }>({
  data,
  columns,
  actions,
}: GenericTableProps<T>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className="font-semibold">
                {column.label}
              </TableHead>
            ))}
            {actions && (
              <TableHead className="w-[50px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="h-24 text-center text-muted-foreground"
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <React.Fragment key={item.id}>
                <TableRow className="hover:bg-muted/50">
                  {columns.map((column) => (
                    <TableCell key={column.key} className="py-4">
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] ?? "-")}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="py-4">
                      <GenericTableActions
                        actions={actions(item)}
                        item={item}
                      />
                    </TableCell>
                  )}
                </TableRow>
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
