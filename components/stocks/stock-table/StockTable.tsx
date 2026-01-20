import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import stockService from '@/services/stock.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Stock {
  uuid?: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
  product?: {
    uuid: string;
    sku: string;
    name: string;
    category: string;
    unitCost: number;
    reorderPoint: number;
  };
  warehouse?: {
    uuid: string;
    name: string;
    location: string;
    code: string;
  };
}

interface StockTableProps {
  warehouseId?: string;
}

const columns: ColumnDef<Stock>[] = [
  {
    header: 'Product Name',
    accessorKey: 'product.name',
    cell: ({ row }) => <span>{row.original.product?.name ?? '-'}</span>,
  },
  {
    header: 'SKU',
    accessorKey: 'product.sku',
    cell: ({ row }) => <span>{row.original.product?.sku ?? '-'}</span>,
  },
  {
    header: 'Category',
    accessorKey: 'product.category',
    cell: ({ row }) => <span>{row.original.product?.category ?? '-'}</span>,
  },
  {
    header: 'Warehouse Name',
    accessorKey: 'warehouse.name',
    cell: ({ row }) => <span>{row.original.warehouse?.name ?? '-'}</span>,
  },
  {
    header: 'Status',
    id: 'status',
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      const reorderPoint = row.original.product?.reorderPoint ?? 0;
      let status = 'In Stock';
      let variant: 'default' | 'destructive' | 'outline' = 'outline';
      if (quantity <= reorderPoint) {
        status = 'Needs Reordering';
        variant = 'destructive';
      } else if (quantity <= reorderPoint * 1.2) {
        status = 'Low Stock';
        variant = 'default';
      }
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

export default function StockTable({ warehouseId }: StockTableProps) {
  const [filter, setFilter] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);

  const params: Record<string, any> = { page, limit, search: filter };
  if (warehouseId !== undefined) params.warehouse = warehouseId;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['paginatedStocks', page, limit, filter, warehouseId],
    queryFn: () => stockService.listPaginated(params),
  });

  const stocks: Stock[] = data?.data || [];
  const total = data?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const table = useReactTable({
    data: stocks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {},
    manualPagination: true,
    pageCount: totalPages,
  });

  React.useEffect(() => {
    table.setPageIndex(page - 1);
  }, [page, table]);

  return (
    <div className="w-full">
      <div className="flex flex-row items-center gap-2 py-4 w-full flex-wrap">
        <Input
          placeholder="Filter by product or warehouse..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="min-w-0 w-full sm:w-1/4 max-w-full"
        />
      </div>
      <div className="overflow-x-auto overflow-y-visible rounded-md border w-full max-w-full">
        <table className="min-w-150 w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-2 py-1 bg-muted text-left font-semibold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="text-center py-4"
                >
                  Loading...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="text-center text-destructive py-4"
                >
                  Failed to load stocks.
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="text-center py-4"
                >
                  No stocks found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-2 py-1">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-background rounded-b-md">
        <div className="text-muted-foreground flex-1 text-sm hidden sm:flex">
          {/* Selection count: update if you add row selection */}0 of {total}{' '}
          row(s) selected.
        </div>
        <div className="flex w-full items-center gap-6 sm:w-fit">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-sm font-medium">Rows per page</span>
            <select
              value={limit}
              disabled
              className="w-20 rounded border px-2 py-1 text-sm bg-background"
            >
              <option value={10}>10</option>
            </select>
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
