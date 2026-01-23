import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import transferService from '@/services/transfer.service';
import TransferItem from '../item/TransferItem';

const PAGE_SIZE = 10;

export default function RejectedTransfersTab({
  fromWarehouseId,
  toWarehouseId,
  productId,
}: {
  fromWarehouseId?: string;
  toWarehouseId?: string;
  productId?: string;
}) {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'transfers',
      'rejected',
      page,
      fromWarehouseId,
      toWarehouseId,
      productId,
    ],
    queryFn: () =>
      transferService.listPaginated({
        page,
        limit: PAGE_SIZE,
        approvalStatus: 'rejected',
        fromWarehouseId: fromWarehouseId || undefined,
        toWarehouseId: toWarehouseId || undefined,
        productId: productId || undefined,
      }),
  });

  const transfers = data?.data || data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading transfers.</div>}
      {!isLoading && !isError && transfers.length === 0 && (
        <div className="text-muted-foreground text-sm">
          No rejected transfers found.
        </div>
      )}
      {!isLoading && !isError && transfers.length > 0 && (
        <div className="flex flex-col w-full">
          {transfers.map((transfer: any) => (
            <TransferItem key={transfer.uuid} transfer={transfer} />
          ))}
        </div>
      )}
      <div className="flex gap-2 mt-4 items-center justify-center w-full">
        <button
          className="btn btn-outline btn-sm"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <span className="text-xs text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-outline btn-sm"
          disabled={page === totalPages || transfers.length < PAGE_SIZE}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
