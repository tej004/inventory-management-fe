'use client';
import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import productService from '@/services/product.service';
import { Product } from '@/types/types/product.type';
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
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import useDebounce from '@/hooks/use-debounce';
import ProductModal from '@/components/products/modal/ProductModal';

export default function ProductTable() {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = React.useState('');
  const debouncedSearch = useDebounce(searchInput, 400);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);

  const params: Record<string, any> = { page, limit, search: debouncedSearch };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['paginatedProducts', page, limit, debouncedSearch],
    queryFn: () => productService.listPaginated(params),
  });

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const products: Product[] = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setModalOpen(true);
  }

  async function handleDelete(uuid?: string) {
    if (!uuid) return;
    if (!confirm('Delete this product?')) return;
    const ok = await productService.delete(uuid);
    if (ok) {
      toast.success('Product deleted');

      refetch();
    } else {
      toast.error('Failed to delete');
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 pb-4 w-full flex-wrap">
        <Input
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="min-w-0 w-full max-w-xs"
        />
        <div className="flex items-center gap-2">
          <Button onClick={openCreate}>Create Product</Button>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-visible rounded-md border w-full max-w-full">
        <Table className="min-w-[600px] w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="px-2 py-1 bg-muted text-left font-semibold">
                SKU
              </TableHead>
              <TableHead className="px-2 py-1 bg-muted text-left font-semibold">
                Name
              </TableHead>
              <TableHead className="px-2 py-1 bg-muted text-left font-semibold">
                Category
              </TableHead>
              <TableHead className="px-2 py-1 bg-muted text-left font-semibold">
                Unit Cost
              </TableHead>
              <TableHead className="px-2 py-1 bg-muted text-left font-semibold">
                Reorder Point
              </TableHead>
              <TableHead className="px-2 py-1 bg-muted text-left font-semibold">
                Created
              </TableHead>
              <TableHead className="px-2 py-1 bg-muted text-left font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p.uuid} className="odd:bg-muted/5">
                  <TableCell className="px-2 py-1 font-mono text-xs">
                    {p.sku}
                  </TableCell>
                  <TableCell className="px-2 py-1">{p.name}</TableCell>
                  <TableCell className="px-2 py-1">{p.category}</TableCell>
                  <TableCell className="px-2 py-1">{p.unitCost}</TableCell>
                  <TableCell className="px-2 py-1">{p.reorderPoint}</TableCell>
                  <TableCell className="px-2 py-1 text-xs text-muted-foreground">
                    {p.createdAt ? new Date(p.createdAt).toLocaleString() : '-'}
                  </TableCell>
                  <TableCell className="px-2 py-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEdit(p)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(p.uuid)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
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
      <ProductModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => {
          setModalOpen(false);
          refetch();
        }}
        editing={editing}
      />
    </div>
  );
}
