import { StockStatusPieCard } from './StockStatusPieCard';
import StockTopQuantityCard from './StockTopQuantityCard';
import StockLowQuantityCard from './StockLowQuantityCard';
import TotalStockQuantityCard from './TotalStockQuantityCard';
import TotalInventoryValueCard from './TotalInventoryValueCard';
import OutOfStockProductCountCard from './OutOfStockProductCountCard';
import InactiveProductCountCard from './InactiveProductCountCard';
import ActiveProductCountCard from './ActiveProductCountCard';

export default function StocksSectionCards({
  warehouseId,
}: {
  warehouseId?: string;
}) {
  return (
    <div>
      <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mb-4">
        <TotalStockQuantityCard warehouseId={warehouseId} />
        <TotalInventoryValueCard warehouseId={warehouseId} />
        <OutOfStockProductCountCard warehouseId={warehouseId} />
        <InactiveProductCountCard warehouseId={warehouseId} />
        <ActiveProductCountCard warehouseId={warehouseId} />
      </div>
      <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full">
        <StockStatusPieCard warehouseId={warehouseId} />
        <StockTopQuantityCard warehouseId={warehouseId} />
        <StockLowQuantityCard warehouseId={warehouseId} />
      </div>
    </div>
  );
}
