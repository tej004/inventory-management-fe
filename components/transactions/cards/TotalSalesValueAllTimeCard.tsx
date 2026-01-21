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

export default function TotalSalesValueAllTimeCard({
  warehouseId,
  productId,
}: {
  warehouseId?: string;
  productId?: string;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['totalSalesValueAllTime', warehouseId, productId],
    queryFn: () =>
      transactionService.totalSalesValueAllTime({
        warehouseId,
        productId,
      }),
  });
  return (
    <Card className="h-full min-h-0">
      <CardHeader className="pb-1 px-3 pt-2">
        <CardTitle className="text-base font-semibold mb-0.5">
          Total Sales Value (All Time)
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground leading-snug mt-0">
          Total sales value for all time
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2 px-3">
        <div className="text-2xl font-bold min-h-0 flex items-center">
          {isLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : error ? (
            <span className="text-destructive">Error</span>
          ) : (
            `$${formatNumberShort(data ?? 0)}`
          )}
        </div>
      </CardContent>
    </Card>
  );
}
