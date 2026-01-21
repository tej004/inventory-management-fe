import { useQuery } from '@tanstack/react-query';
import transactionService from '@/services/transaction.service';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { formatNumberShort } from '@/lib/formatNumberShort';

export default function TotalTransactionValueCard({
  warehouseId,
  productId,
  startDate,
  endDate,
  reason,
  title = 'Total Transaction Value',
  description = 'Total value of all transactions in the selected period.',
  currency = '₱',
}: {
  warehouseId?: string;
  productId?: string;
  startDate: string;
  endDate: string;
  reason?: string;
  title?: string;
  description?: string;
  currency?: string;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: [
      'totalTransactionValue',
      warehouseId,
      productId,
      startDate,
      endDate,
      reason,
    ],
    queryFn: () =>
      transactionService.totalTransactionValue({
        warehouseId,
        productId,
        startDate,
        endDate,
        reason,
      }),
  });
  return (
    <Card className="h-full min-h-0">
      <CardHeader className="pb-1 px-3 pt-2">
        <CardTitle className="text-base font-semibold mb-0.5">
          {title}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground leading-snug mt-0">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2 px-3">
        <div className="text-2xl font-bold min-h-0 flex items-center">
          {isLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : error ? (
            <span className="text-destructive">Error</span>
          ) : (
            `${currency}${formatNumberShort(data ?? 0)}`
          )}
        </div>
      </CardContent>
    </Card>
  );
}
