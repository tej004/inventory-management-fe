'use client';
import StocksSectionCards from '@/components/stocks/section-cards/StocksSectionCards';
import StockTable from '@/components/stocks/stock-table/StockTable';
import * as React from 'react';
import StockChartTable from '../chart/StockChartTable';
import WarehouseFilter from '@/components/filters/WarehouseFilter';

export default function ContentContainer() {
  const [warehouseId, setWarehouseId] = React.useState<string>('all');
  return (
    <div className="flex flex-col gap-4 w-full max-w-full min-w-0">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between w-full">
          <WarehouseFilter value={warehouseId} onChange={setWarehouseId} />
        </div>
      </div>
      <div className="w-full">
        <StocksSectionCards
          warehouseId={warehouseId === 'all' ? undefined : warehouseId}
        />
      </div>
      {/* <div className="w-full max-w-full min-w-0">
        <StockChartTable
          warehouseId={warehouseId === 'all' ? undefined : warehouseId}
        />
      </div> */}
      <div className="w-full max-w-full min-w-0">
        <StockTable
          warehouseId={warehouseId === 'all' ? undefined : warehouseId}
        />
      </div>
    </div>
  );
}
