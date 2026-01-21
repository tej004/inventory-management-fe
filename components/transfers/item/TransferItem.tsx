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
      <div className="flex items-center w-full max-w-5xl mx-auto px-4 py-2 gap-2 md:gap-4">
        {/* Product */}
        <span className="flex-1 min-w-0 font-medium truncate text-sm md:text-base">
          {transfer.product?.sku || 'Unknown Product'}
        </span>
        {/* From → To */}
        <span className="hidden md:inline text-xs text-muted-foreground truncate max-w-30">
          {transfer.fromWarehouse?.code || transfer.fromWarehouseId}
        </span>
        <span className="hidden md:inline text-xs text-muted-foreground">
          →
        </span>
        <span className="hidden md:inline text-xs text-muted-foreground truncate max-w-30">
          {transfer.toWarehouse?.code || transfer.toWarehouseId}
        </span>
        {/* Qty */}
        <span className="w-12 text-xs text-right font-mono">
          {transfer.quantity}
        </span>

        {/* Actions */}
        {actions && (
          <div className="flex gap-2 items-center ml-2">{actions}</div>
        )}
      </div>
    </Card>
  );
}
