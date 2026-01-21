import * as React from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import ProductFilter from '@/components/filters/ProductFilter';
import DateFilter from '@/components/filters/DateFilter';

export interface TransactionFiltersProps {
  warehouseId: string;
  onWarehouseIdChange: (id: string) => void;
  warehouseOptions: Array<{ uuid: string; code: string; name: string }>;
  productId: string;
  onProductIdChange: (id: string) => void;
  productSearch: string;
  onProductSearchChange: (v: string) => void;
  productOptions: Array<{ uuid: string; sku: string; name: string }>;
  productLoading: boolean;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
}

export default function TransactionFilters({
  warehouseId,
  onWarehouseIdChange,
  warehouseOptions,
  productId,
  onProductIdChange,
  productSearch,
  onProductSearchChange,
  productOptions,
  productLoading,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 w-full">
      {/* Left group: Warehouse and Product filters */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* Warehouse filter */}
        <div className="flex flex-col gap-1 min-w-[180px]">
          <span className="text-xs text-muted-foreground mb-1">Warehouse</span>
          <Select
            value={warehouseId || '__ALL__'}
            onValueChange={(val) =>
              onWarehouseIdChange(val === '__ALL__' ? '' : val)
            }
          >
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Select warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__ALL__">ALL</SelectItem>
              {warehouseOptions.map((w) => (
                <SelectItem key={w.uuid} value={w.uuid}>
                  {w.code}{' '}
                  <span className="text-xs text-muted-foreground">
                    {w.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Product filter */}
        <div className="flex flex-col gap-1 min-w-[180px]">
          <span className="text-xs text-muted-foreground mb-1">Product</span>
          <ProductFilter
            productId={productId}
            onProductIdChange={onProductIdChange}
            productSearch={productSearch}
            onProductSearchChange={onProductSearchChange}
            productOptions={productOptions}
            productLoading={productLoading}
            placeholder="Search product..."
            showAllOption={true}
          />
        </div>
      </div>
      {/* Right group: Date filters */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* Start date filter */}
        <DateFilter
          label="Start Date"
          value={startDate}
          onChange={onStartDateChange}
        />

        {/* End date filter */}
        <DateFilter
          label="End Date"
          value={endDate}
          onChange={onEndDateChange}
          min={startDate}
        />
      </div>
    </div>
  );
}
