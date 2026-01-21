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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import stockService from '@/services/stock.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import StockModal from './StockModal';
import { formatNumberShort } from '@/lib/formatNumberShort';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

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
    header: 'SKU',
    accessorKey: 'product.sku',
    cell: ({ row }) => <span>{row.original.product?.sku ?? '-'}</span>,
  },
  {
    header: 'Product Name',
    accessorKey: 'product.name',
    cell: ({ row }) => <span>{row.original.product?.name ?? '-'}</span>,
  },
  {
    header: 'Unit Cost',
    accessorKey: 'product.unitCost',
    cell: ({ row }) => {
      const unitCost = row.original.product?.unitCost;
      return unitCost !== undefined && unitCost !== null
        ? `$${unitCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '-';
    },
  },
  {
    header: 'Quantity',
    accessorKey: 'quantity',
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      return formatNumberShort(quantity);
    },
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
      let variant: 'default' | 'outline' = 'outline';
      if (quantity <= reorderPoint * 1.2) {
        status = 'Low Stock';
        variant = 'default';
      }
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

export default function StockTable({ warehouseId }: StockTableProps) {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [filterInput, setFilterInput] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [statusFilter, setStatusFilter] = React.useState<
    'all' | 'inStock' | 'lowStock'
  >('all');

  React.useEffect(() => {
    const t = setTimeout(() => {
      setFilter(filterInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [filterInput]);

  const params: Record<string, any> = { page, limit, search: filter };
  if (warehouseId !== undefined) params.warehouse = warehouseId;
  if (statusFilter === 'inStock') {
    params.status = 'inStock';
  } else if (statusFilter === 'lowStock') {
    params.status = 'lowStock';
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      'paginatedStocks',
      page,
      limit,
      filter,
      warehouseId,
      statusFilter,
    ],
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

  async function handleDeleteStock(uuid?: string) {
    if (!uuid) return;
    if (!window.confirm('Delete this stock?')) return;
    const ok = await stockService.delete(uuid);
    if (ok) {
      toast.success('Stock deleted');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['totalInventoryValue'] }),
        queryClient.invalidateQueries({ queryKey: ['outOfStockProductCount'] }),
        queryClient.invalidateQueries({
          queryKey: ['productsByQuantityOrder'],
        }),
        queryClient.invalidateQueries({ queryKey: ['inactiveProductCount'] }),
        queryClient.invalidateQueries({ queryKey: ['stockStatusPie'] }),
        queryClient.invalidateQueries({ queryKey: ['activeProductCount'] }),
        queryClient.invalidateQueries({ queryKey: ['totalStockQuantity'] }),
        queryClient.invalidateQueries({ queryKey: ['stockAreaChart'] }),
        queryClient.invalidateQueries({ queryKey: ['warehouses'] }),
      ]);
      refetch();
    } else {
      toast.error('Failed to delete stock');
    }
  }

  React.useEffect(() => {
    table.setPageIndex(page - 1);
  }, [page, table]);

  function handleCreate() {
    setModalOpen(true);
  }

  return (
    <div className="w-full">
      <StockModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onCreated={() => {
          refetch();
        }}
        filterByWarehouseId={warehouseId}
      />
      <div className="flex flex-row items-center gap-2 pb-4 w-full flex-wrap">
        <Input
          placeholder="Filter by product or warehouse..."
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
          className="min-w-0 w-full sm:w-1/4 max-w-full"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-36 justify-between">
              {statusFilter === 'all'
                ? 'All Status'
                : statusFilter === 'inStock'
                  ? 'In Stock'
                  : 'Low Stock'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36">
            <DropdownMenuItem onSelect={() => setStatusFilter('all')}>
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setStatusFilter('inStock')}>
              In Stock
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setStatusFilter('lowStock')}>
              Low Stock
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="default" onClick={handleCreate} className="ml-auto">
          Create New Stock
        </Button>
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
                <th className="px-2 py-1 bg-muted text-left font-semibold">
                  Actions
                </th>
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
              table.getRowModel().rows.map((row: any) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell: any) => (
                    <td key={cell.id} className="px-2 py-1">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                  <td className="px-2 py-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDeleteStock(row.original.uuid)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
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
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
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
