'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';

import { ChevronDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import productService from '@/services/product.service';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/types/product.type';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'sku',
    header: 'SKU',
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue('sku')}</span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('name')}</span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'unitCost',
    header: () => <div className="text-right">Unit Cost</div>,
    cell: ({ row }) => {
      const value = row.getValue('unitCost');
      return (
        <div className="text-right">
          {value === null || value === undefined || value === ''
            ? '-'
            : typeof value === 'number'
              ? value.toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'USD',
                })
              : Number(value).toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'USD',
                })}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'reorderPoint',
    header: () => <div className="text-right">Reorder Point</div>,
    cell: ({ row }) => (
      <div className="text-right">{row.getValue('reorderPoint')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'isDeleted',
    header: 'Status',
    cell: ({ row }) =>
      row.getValue('isDeleted') ? (
        <Badge variant="destructive">Deleted</Badge>
      ) : (
        <Badge variant="outline">Active</Badge>
      ),
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const val = row.getValue('createdAt');
      if (typeof val === 'string' || typeof val === 'number') {
        return (
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {new Date(val).toLocaleString()}
          </span>
        );
      }
      return <span className="text-xs text-muted-foreground">-</span>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ row }) => {
      const val = row.getValue('updatedAt');
      if (typeof val === 'string' || typeof val === 'number') {
        return (
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {new Date(val).toLocaleString()}
          </span>
        );
      }
      return <span className="text-xs text-muted-foreground">-</span>;
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.sku)}
            >
              Copy SKU
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function ProductTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [filter, setFilter] = React.useState('');
  const [deletedFilter, setDeletedFilter] = React.useState<
    'all-products' | 'active' | 'deleted'
  >('all-products');

  // Build params for API
  const params: Record<string, any> = { page, limit, search: filter };
  if (deletedFilter === 'active') params.includeDeleted = false;
  if (deletedFilter === 'deleted') params.deletedOnly = true;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['paginatedProducts', page, limit, filter, deletedFilter],
    queryFn: () => productService.listPaginated(params),
  });

  const products: Product[] = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const table = useReactTable({
    data: products,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
    pageCount: totalPages,
  });

  React.useEffect(() => {
    table.setPageIndex(page - 1);
  }, [page, table]);

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between gap-2 pt-2 pb-4 w-full flex-wrap">
        <Input
          placeholder="Filter by name or SKU..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="min-w-0 w-full sm:w-1/4 max-w-full"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 min-w-[180px] w-full sm:w-auto justify-between"
            >
              {deletedFilter === 'all-products' &&
                'All Products (Active and Deleted)'}
              {deletedFilter === 'active' && 'Active Only'}
              {deletedFilter === 'deleted' && 'Deleted Only'}
              <ChevronDown className="w-4 h-4 ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setDeletedFilter('all-products')}>
              All Products (Active and Deleted)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeletedFilter('active')}>
              Active Only
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeletedFilter('deleted')}>
              Deleted Only
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border w-full max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-2 py-1 bg-muted text-left font-semibold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="text-center py-4"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="text-center text-destructive py-4"
                >
                  Failed to load products.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="text-center py-4"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={row.original.isDeleted ? 'opacity-60' : ''}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2 py-1">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-background rounded-b-md">
        <div className="text-muted-foreground flex-1 text-sm hidden sm:flex">
          0 of {total} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-6 sm:w-fit">
          <div className="hidden items-center gap-2 sm:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={String(limit)}
              onValueChange={(value) => {
                setLimit(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={limit} />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {page} of {totalPages || 1}
          </div>
          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 sm:flex"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              <span className="sr-only">Go to first page</span>
              &laquo;
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <span className="sr-only">Go to previous page</span>
              &lsaquo;
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() =>
                setPage((p) =>
                  totalPages ? Math.min(totalPages, p + 1) : p + 1
                )
              }
              disabled={page === totalPages || totalPages === 0}
            >
              <span className="sr-only">Go to next page</span>
              &rsaquo;
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 sm:flex"
              size="icon"
              onClick={() => setPage(totalPages || 1)}
              disabled={page === totalPages || totalPages === 0}
            >
              <span className="sr-only">Go to last page</span>
              &raquo;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
