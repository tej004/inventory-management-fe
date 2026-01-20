import { StockStatusPieCard } from './StockStatusPieCard';
import StockTopQuantityCard from './StockTopQuantityCard';
import StockLowQuantityCard from './StockLowQuantityCard';

export default function StocksSectionCards({
  warehouseId,
}: {
  warehouseId?: string;
}) {
  return (
    <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full">
      <StockStatusPieCard warehouseId={warehouseId} />
      <StockTopQuantityCard warehouseId={warehouseId} />
      <StockLowQuantityCard warehouseId={warehouseId} />
    </div>
  );
}
