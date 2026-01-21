import { useQueryClient } from '@tanstack/react-query';

/**
 * Invalidates all queries related to the transaction page.
 * Call this after any transaction mutation (create, update, delete).
 */
export function useInvalidateTransactionPage() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['paginatedTransactions'] });
    queryClient.invalidateQueries({ queryKey: ['totalTransactionValue'] });
    queryClient.invalidateQueries({ queryKey: ['totalSalesValueAllTime'] });
    queryClient.invalidateQueries({ queryKey: ['dailySalesChart'] });
    queryClient.invalidateQueries({ queryKey: ['dailyWarehouseSales'] });
    queryClient.invalidateQueries({ queryKey: ['TransactionSectionCards'] });
    // Add more keys as needed for your transaction dashboard
  };
}
