'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import warehouseService, { Warehouse } from '@/services/warehouse.service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import useDebounce from '@/hooks/use-debounce';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import WarehouseModal from '../modal/WarehouseModal';

export default function WarehouseTable() {
  const [searchInput, setSearchInput] = React.useState('');
  const debouncedSearch = useDebounce(searchInput, 400);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Warehouse | null>(null);

  const params: Record<string, any> = { page, limit, search: debouncedSearch };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['paginatedWarehouses', page, limit, debouncedSearch],
    queryFn: () => warehouseService.listPaginated(params),
  });

  // when debounced search value changes, reset to first page
  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const warehouses: Warehouse[] = data || [];
  const total = data?.meta?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(w: Warehouse) {
    setEditing(w);
    setModalOpen(true);
  }

  async function handleDelete(uuid?: string) {
    if (!uuid) return;
    if (!confirm('Delete this warehouse?')) return;
    const ok = await warehouseService.delete(uuid);
    if (ok) {
      toast.success('Warehouse deleted');
      refetch();
    } else {
      toast.error('Failed to delete');
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 pb-4 w-full flex-wrap">
        <Input
          placeholder="Search warehouses..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="min-w-0 w-full max-w-xs"
        />
        <div className="flex items-center gap-2">
          <Button onClick={openCreate}>Create Warehouse</Button>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-visible rounded-md border w-full max-w-full">
        <table className="min-w-[600px] w-full text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1 bg-muted text-left font-semibold">
                Code
              </th>
              <th className="px-2 py-1 bg-muted text-left font-semibold">
                Name
              </th>
              <th className="px-2 py-1 bg-muted text-left font-semibold">
                Location
              </th>
              <th className="px-2 py-1 bg-muted text-left font-semibold">
                Created
              </th>
              <th className="px-2 py-1 bg-muted text-left font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : warehouses.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No warehouses found.
                </td>
              </tr>
            ) : (
              warehouses.map((w) => (
                <tr key={w.uuid} className="odd:bg-muted/5">
                  <td className="px-2 py-1">{w.code}</td>
                  <td className="px-2 py-1">{w.name}</td>
                  <td className="px-2 py-1">{w.location}</td>
                  <td className="px-2 py-1 text-xs text-muted-foreground">
                    {w['createdAt']
                      ? new Date((w as any).createdAt).toLocaleString()
                      : '-'}
                  </td>
                  <td className="px-2 py-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEdit(w)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(w.uuid)}>
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
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {page} of {totalPages}
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

      <WarehouseModal
        open={modalOpen}
        onOpenChange={(o) => setModalOpen(o)}
        warehouse={editing}
        onSaved={() => refetch()}
      />
    </div>
  );
}
