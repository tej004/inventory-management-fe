import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import transferService from '@/services/transfer.service';
import { Button } from '@/components/ui/button';
import TransferItem from '../item/TransferItem';
import { useInvalidateTransferPage } from '@/components/transactions/hooks/useInvalidateTransferPage';

const PAGE_SIZE = 10;

interface ApprovedTransfersTabProps {
  fromWarehouseId?: string;
  toWarehouseId?: string;
  productId?: string;
}

export default function ApprovedTransfersTab({
  fromWarehouseId,
  toWarehouseId,
  productId,
}: ApprovedTransfersTabProps) {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'transfers',
      'approved',
      page,
      fromWarehouseId,
      toWarehouseId,
      productId,
    ],
    queryFn: () =>
      transferService.listPaginated({
        page,
        limit: PAGE_SIZE,
        approvalStatus: 'approved',
        fromWarehouseId: fromWarehouseId || undefined,
        toWarehouseId: toWarehouseId || undefined,
        productId: productId || undefined,
      }),
  });

  const transfers = data?.data || data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  const invalidateTransferPage = useInvalidateTransferPage();

  const handleReceive = async (uuid: string) => {
    await transferService.receive(uuid);
    await invalidateTransferPage();
  };

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading transfers.</div>}
      {!isLoading && !isError && transfers.length === 0 && (
        <div className="text-muted-foreground text-sm">
          No approved transfers found.
        </div>
      )}
      {!isLoading && !isError && transfers.length > 0 && (
        <div className="flex flex-col w-full">
          {transfers.map((transfer: any) => (
            <TransferItem
              key={transfer.uuid}
              transfer={transfer}
              actions={
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleReceive(transfer.uuid)}
                >
                  Receive
                </Button>
              }
            />
          ))}
        </div>
      )}
      <div className="flex gap-2 mt-4 items-center justify-center w-full">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <span className="text-xs text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages || transfers.length < PAGE_SIZE}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
