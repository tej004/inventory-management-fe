import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import transactionService from '@/services/transaction.service';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import TransactionModal from '../modal/TransactionModal';

interface TransactionTableProps {
  warehouseId?: string;
  productId?: string;
}

export default function TransactionTable({
  warehouseId,
  productId,
}: TransactionTableProps) {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);

  const params: Record<string, any> = { page, limit };
  if (warehouseId) params.warehouseId = warehouseId;
  if (productId) params.productId = productId;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['paginatedTransactions', page, limit],
    queryFn: () => transactionService.listPaginated(params),
  });

  const transactions = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-end gap-2 pb-4 w-full flex-wrap">
        <div className="flex items-center gap-2">
          <Button onClick={openCreate}>Create Transaction</Button>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-visible rounded-md border w-full max-w-full">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1 bg-muted text-left font-semibold">
                Type
              </th>
              <th className="px-2 py-1 bg-muted text-left font-semibold">
                Reason
              </th>
              <th className="px-2 py-1 bg-muted text-left font-semibold">
                Quantity
              </th>
              <th className="px-2 py-1 bg-muted text-left font-semibold">
                Product
              </th>
              <th className="px-2 py-1 bg-muted text-left font-semibold">
                Category
              </th>
              <th className="px-2 py-1 bg-muted text-left font-semibold">
                Warehouse
              </th>
              <th className="px-2 py-1 bg-muted text-left font-semibold">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((t: any) => (
                <tr key={t.uuid} className="odd:bg-muted/5">
                  <td className="px-2 py-1">
                    {t.type
                      ? t.type.charAt(0).toUpperCase() + t.type.slice(1)
                      : '-'}
                  </td>
                  <td className="px-2 py-1">
                    {t.reason
                      ? t.reason.charAt(0).toUpperCase() + t.reason.slice(1)
                      : '-'}
                  </td>
                  <td className="px-2 py-1">
                    {t.quantity != null ? t.quantity : '-'}
                  </td>
                  <td className="px-2 py-1">{t.product?.name || '-'}</td>
                  <td className="px-2 py-1">{t.product?.category || '-'}</td>
                  <td className="px-2 py-1">{t.warehouse?.name || '-'}</td>
                  <td className="px-2 py-1 text-xs text-muted-foreground">
                    {t.createdAt ? new Date(t.createdAt).toLocaleString() : '-'}
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
      <TransactionModal
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
