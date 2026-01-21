'use client';
import * as React from 'react';
import TransactionFilters from '../filters/TransactionFilters';
import { useTransactionFilters } from '../hooks/useTransactionFilters';
import TransactionSectionCards from '../cards/TransactionSectionCards';
import TransactionChart from '../chart/TransactionChart';
import TransactionTable from '../table/TransactionTable';

export default function ContentContainer() {
  const filterProps = useTransactionFilters();
  return (
    <div className="flex flex-col gap-4 w-full max-w-full min-w-0">
      <TransactionFilters {...filterProps} />
      <TransactionSectionCards
        warehouseId={filterProps?.warehouseId}
        productId={filterProps?.productId}
        startDate={filterProps?.startDate}
        endDate={filterProps?.endDate}
      />
      <TransactionChart
        warehouseId={filterProps?.warehouseId}
        productId={filterProps?.productId}
        startDate={filterProps?.startDate}
        endDate={filterProps?.endDate}
      />
      <TransactionTable
        warehouseId={filterProps?.warehouseId}
        productId={filterProps?.productId}
      />
    </div>
  );
}
