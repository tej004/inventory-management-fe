import { useQueryClient } from '@tanstack/react-query';

export function useInvalidateTransactionPage() {
  const queryClient = useQueryClient();

  return () => {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: ['paginatedTransactions'] }),
      queryClient.invalidateQueries({ queryKey: ['totalTransactionValue'] }),
      queryClient.invalidateQueries({ queryKey: ['totalSalesValueAllTime'] }),
      queryClient.invalidateQueries({ queryKey: ['dailySalesChart'] }),
      queryClient.invalidateQueries({ queryKey: ['dailyWarehouseSales'] }),
      queryClient.invalidateQueries({ queryKey: ['TransactionSectionCards'] }),
    ]);
  };
}
