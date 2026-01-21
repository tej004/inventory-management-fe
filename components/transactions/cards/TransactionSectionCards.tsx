import TotalSalesValueAllTimeCard from './TotalSalesValueAllTimeCard';
import TotalTransactionValueCard from './TotalTransactionValueCard';

export default function TransactionSectionCards({
  warehouseId,
  productId,
  startDate,
  endDate,
}: {
  warehouseId?: string;
  productId?: string;
  startDate: string;
  endDate: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      <TotalTransactionValueCard
        warehouseId={warehouseId}
        productId={productId}
        startDate={startDate}
        endDate={endDate}
        reason="sale"
        title="Total Sales Value"
        description="Total value of all sales in the selected period"
        currency="$"
      />
      <TotalSalesValueAllTimeCard
        warehouseId={warehouseId}
        productId={productId}
      />
      <TotalTransactionValueCard
        warehouseId={warehouseId}
        productId={productId}
        startDate={startDate}
        endDate={endDate}
        reason="return"
        title="Total Return Value"
        description="Total value of all returns in the selected period"
        currency="$"
      />
    </div>
  );
}
