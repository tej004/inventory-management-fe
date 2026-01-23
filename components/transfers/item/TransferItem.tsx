import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export interface TransferItemProps {
  transfer: {
    uuid: string;
    productId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    quantity: number;
    approvalStatus: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    fromWarehouse?: { uuid: string; name: string; code: string };
    toWarehouse?: { uuid: string; name: string; code: string };
    product?: {
      uuid: string;
      sku: string;
      name: string;
      category: string;
      unitCost: number;
    };
  };
  actions?: React.ReactNode;
}

export default function TransferItem({ transfer, actions }: TransferItemProps) {
  return (
    <Card className="w-full my-1 border bg-background transition hover:shadow-sm px-0 py-0">
      <div className="flex flex-row w-full px-2 py-1 md:px-4 md:py-2 gap-2 md:gap-4 items-start md:items-center">
        <div className="flex flex-col flex-1 min-w-0 w-full">
          <span className="font-medium truncate text-sm md:text-base">
            {transfer.product?.sku || 'Unknown Product'}
          </span>
          <div className="flex flex-row items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <span className="truncate max-w-[120px] md:max-w-30">
              {transfer.fromWarehouse?.code || transfer.fromWarehouseId}
            </span>
            <span>→</span>
            <span className="truncate max-w-[120px] md:max-w-30">
              {transfer.toWarehouse?.code || transfer.toWarehouseId}
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-0.5">
            {transfer.createdAt
              ? new Date(transfer.createdAt).toLocaleString(undefined, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </span>
        </div>
        <div className="flex flex-col items-end justify-between h-full min-w-[3.5rem]">
          <span className="text-xs text-right font-mono">
            {transfer.quantity}
          </span>
          {actions && (
            <div className="flex gap-2 items-center ml-0 md:ml-2 mt-1 md:mt-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
