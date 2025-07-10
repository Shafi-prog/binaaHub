import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/domains/shared/components/ui/table";
import { cn } from "@/domains/shared/utils";

interface DataTableProps<TData, TValue> {
  columns: any[];
  data: TData[];
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
}: DataTableProps<TData, TValue>) {
  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>
                {column.header || column.accessorKey}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length ? (
            data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {column.cell 
                      ? column.cell({ row: { original: row } })
                      : (row as any)[column.accessorKey]
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Export as _DataTable to match the expected import
export const _DataTable = DataTable;
