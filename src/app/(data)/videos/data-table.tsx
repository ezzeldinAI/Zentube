"use client";

import type { ColumnDef, ColumnFiltersState, PaginationState, RowSelectionState, SortingState } from "@tanstack/react-table";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronDown, Trash2 } from "lucide-react";
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { Button } from "zentube/ui/button";
import { Checkbox } from "zentube/ui/checkbox";
import { DataTablePagination } from "zentube/ui/data-table-pagination";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "zentube/ui/dropdown-menu";
import { Input } from "zentube/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "zentube/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "zentube/ui/table";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  totalCount?: number;
  onSelectionChange?: (selectedRows: TData[]) => void;
};

export function DataTable<TData, TValue>({ columns, data, onRowClick, totalCount, onSelectionChange }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [visibilityFilter] = useState<string>("both");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const sortableColumns = ["date", "views", "comments", "likes"];

  const utils = trpc.useUtils();

  const removeMany = trpc.videos.removeMany.useMutation({
    onSuccess: () => {
      utils.studio.getManyPaginated.invalidate();
      utils.studio.getMany.invalidate();
      toast.success("Selected videos deleted successfully");
      setRowSelection({});
    },
    onError: () => {
      toast.error("Failed to delete videos");
    },
  });

  // Create selection column
  const selectionColumn: ColumnDef<TData, TValue> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
          || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  // Add selection column to the beginning of columns
  const columnsWithSelection = [selectionColumn, ...columns];

  const table = useReactTable({
    data,
    columns: columnsWithSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: { sorting, columnFilters, rowSelection, pagination },
  });

  // Get selected rows
  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);

  // Notify parent component of selection changes
  useEffect(() => {
    onSelectionChange?.(selectedRows);
  }, [selectedRows, onSelectionChange]);

  const handleBulkDelete = () => {
    const videoIds = selectedRows.map((row: any) => row.id);
    removeMany.mutate({ ids: videoIds });
  };

  const visibleSortableColumns = table.getAllColumns().filter(
    col => sortableColumns.includes(col.id) && col.getIsVisible(),
  );

  // Handle sort change
  // const handleSortChange = (selected: string) => {
  //   if (sortColumn === selected) {
  //     // Toggle direction
  //     const newDir = sortDirection === "asc" ? "desc" : "asc";
  //     setSortDirection(newDir);
  //     setSorting([{ id: selected, desc: newDir === "desc" }]);
  //   }
  //   else {
  //     setSortColumn(selected);
  //     setSortDirection("asc");
  //     setSorting([{ id: selected, desc: false }]);
  //   }
  // };

  // Update the table filter when visibilityFilter changes
  useEffect(() => {
    if (visibilityFilter === "both") {
      table.getColumn("visibility")?.setFilterValue("");
    }
    else {
      table.getColumn("visibility")?.setFilterValue(visibilityFilter);
    }
  }, [visibilityFilter]);

  // Whenever visibleSortableColumns changes, update sortColumn/sortDirection if needed
  useEffect(() => {
    if (sortColumn && !visibleSortableColumns.some(col => col.id === sortColumn)) {
      setSortColumn(null);
      setSorting([]);
    }
    // Do nothing if sortColumn is already null
  }, [visibleSortableColumns, sortColumn]);

  // nuqs integration for hidden columns and sort state
  const [hiddenColumns, setHiddenColumns] = useQueryState(
    "hidden",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withDefault(""),
  );
  const [query, setQuery] = useQueryState(
    "query",
    parseAsString.withDefault(""),
  );
  const [visibility, setVisibility] = useQueryState(
    "visibility",
    parseAsString.withDefault("both"),
  );
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(0),
  );
  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(20),
  );

  // Restore pagination from URL
  useEffect(() => {
    setPagination({
      pageIndex: page ?? 0,
      pageSize: pageSize ?? 20,
    });
  }, [page, pageSize]);

  // Sync pagination changes to URL
  useEffect(() => {
    setPage(pagination.pageIndex);
    setPageSize(pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize, setPage, setPageSize]);

  // Restore hidden columns from URL
  useEffect(() => {
    table.setColumnVisibility(
      Object.fromEntries(
        table.getAllColumns().map(col => [col.id, !hiddenColumns.includes(col.id)]),
      ),
    );
  }, [hiddenColumns.join(","), table]);

  // Restore sort from URL
  useEffect(() => {
    if (sort) {
      const [id, dir] = sort.split(":");
      setSorting([{ id, desc: dir === "desc" }]);
      setSortColumn(id);
      setSortDirection(dir === "desc" ? "desc" : "asc");
    }
    else {
      setSorting([]);
      setSortColumn(null);
      setSortDirection("asc");
    }
  }, [sort]);

  // Restore search query from URL
  useEffect(() => {
    table.getColumn("title")?.setFilterValue(query);
  }, [query]);

  // Sync visibility filter with table
  useEffect(() => {
    if (visibility === "both") {
      table.getColumn("visibility")?.setFilterValue("");
    }
    else {
      table.getColumn("visibility")?.setFilterValue(visibility);
    }
  }, [visibility]);

  return (
    <div className="rounded-md border p-4">
      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-md">
          <span className="text-sm text-muted-foreground">
            {selectedRows.length}
            {" "}
            row
            {selectedRows.length === 1 ? "" : "s"}
            {" "}
            selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Bulk Actions
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleBulkDelete} variant="destructive">
                  <Trash2 className="size-4 mr-2" />
                  Delete
                  {" "}
                  {selectedRows.length}
                  {" "}
                  videos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRowSelection({})}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 mb-4 justify-between">
        <div className="flex ">
          <Input
            placeholder="Search videos..."
            value={query}
            onChange={event => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            className="min-w-sm"
          />

          {/* Combined Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2 min-w-[140px] flex items-center justify-between">
                Sort:
                {" "}
                {sortColumn
                  ? (
                      <>
                        {sortColumn.charAt(0).toUpperCase() + sortColumn.slice(1)}
                        {sortDirection === "asc" ? <ArrowUp className="ml-1 w-4 h-4" /> : <ArrowDown className="ml-1 w-4 h-4" />}
                      </>
                    )
                  : "None"}
                <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={sortColumn ?? "none"}
                onValueChange={(val) => {
                  if (val === "none") {
                    setSortColumn(null);
                    setSorting([]);
                    setSort("");
                  }
                  else {
                    setSortColumn(val);
                    setSorting([{ id: val, desc: sortDirection === "desc" }]);
                    setSort(`${val}:${sortDirection}`);
                  }
                }}
              >
                <DropdownMenuRadioItem value="none">None</DropdownMenuRadioItem>
                {visibleSortableColumns.map(col => (
                  <DropdownMenuRadioItem key={col.id} value={col.id}>
                    {col.id.charAt(0).toUpperCase() + col.id.slice(1)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Direction</DropdownMenuLabel>
              <div className={sortColumn ? undefined : "opacity-50 pointer-events-none"}>
                <DropdownMenuRadioGroup
                  value={sortDirection}
                  onValueChange={(dir) => {
                    if (!sortColumn)
                      return;
                    setSortDirection(dir as "asc" | "desc");
                    setSorting([{ id: sortColumn, desc: dir === "desc" }]);
                    setSort(`${sortColumn}:${dir}`);
                  }}
                >
                  <DropdownMenuRadioItem value="asc">
                    Ascending
                    <ArrowUp className="inline w-4 h-4 ml-1" />
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="desc">
                    Descending
                    <ArrowDown className="inline w-4 h-4 ml-1" />
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <span className="flex items-center gap-2">
          <Select value={visibility} onValueChange={setVisibility}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both" className="w-full">Both</SelectItem>
              <SelectItem value="public" className="w-full">Public</SelectItem>
              <SelectItem value="private" className="w-full">Private</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">
                Columns
                {" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter(
                  column =>
                    ["views", "comments", "likes"].includes(column.id) && column.getCanHide(),
                )
                .map(column => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: boolean) => {
                      column.toggleVisibility(!!value);
                      // Update hiddenColumns in URL
                      const hidden = table.getAllColumns()
                        .filter(col => !col.getIsVisible() || (col.id === column.id && !value))
                        .map(col => col.id);
                      setHiddenColumns(hidden);
                    }}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length
            ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    className={onRowClick ? "cursor-pointer hover:bg-muted/50" : undefined}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )
            : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} totalCount={totalCount} />
    </div>
  );
}
