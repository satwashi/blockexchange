"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type TableSkeletonProps = {
  columnsCount?: number;
  rowsCount?: number;
};

export function TableSkeleton({
  columnsCount = 6,
  rowsCount = 5,
}: TableSkeletonProps) {
  // column widths matching your original table layout
  const columnWidths = [
    "w-[80px]", // ID
    "w-[300px]", // Property
    "w-[120px]", // Price
    "w-[120px]", // Status
    "w-[100px]", // Available
    "w-[90px]", // Verified
  ];

  // delay between rows in seconds
  const delayStep = 0.15;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {[...Array(columnsCount)].map((_, i) => (
            <TableHead
              key={i}
              className={`${columnWidths[i] ?? "w-auto"} px-3 py-2 text-left`}
            >
              <Skeleton className="h-4 w-16" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(rowsCount)].map((_, rowIndex) => (
          <TableRow
            key={rowIndex}
            className={rowIndex % 2 === 0 ? "bg-background" : "bg-muted"}
            style={{
              animationDelay: `${rowIndex * delayStep}s`,
              animationFillMode: "forwards",
              animationName: "fadeIn",
              animationDuration: "0.4s",
            }}
          >
            {[...Array(columnsCount)].map((_, colIndex) => (
              <TableCell
                key={colIndex}
                className={`${
                  columnWidths[colIndex] ?? "w-auto"
                } px-3 py-2 align-middle`}
              >
                {colIndex === 1 ? (
                  <div className="flex items-center gap-3">
                    <Skeleton
                      className="h-12 w-12 rounded-md"
                      style={{ animationDelay: `${rowIndex * delayStep}s` }}
                    />
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <Skeleton
                        className="h-4 w-32"
                        style={{
                          animationDelay: `${rowIndex * delayStep + 0.1}s`,
                        }}
                      />
                      <Skeleton
                        className="h-3 w-40"
                        style={{
                          animationDelay: `${rowIndex * delayStep + 0.2}s`,
                        }}
                      />
                    </div>
                  </div>
                ) : colIndex === 4 || colIndex === 5 ? (
                  <Skeleton
                    className="h-5 w-12 rounded-md"
                    style={{ animationDelay: `${rowIndex * delayStep}s` }}
                  />
                ) : (
                  <Skeleton
                    className="h-4 w-20"
                    style={{ animationDelay: `${rowIndex * delayStep}s` }}
                  />
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      {/* <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style> */}
    </Table>
  );
}
