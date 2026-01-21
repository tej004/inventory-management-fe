import { useQuery } from '@tanstack/react-query';
import stockService from '@/services/stock.service';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { formatNumberShort } from '@/lib/formatNumberShort';
export default function OutOfStockProductCountCard({
  warehouseId,
}: {
  warehouseId?: string;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['outOfStockProductCount', warehouseId],
    queryFn: () => stockService.outOfStockProductCount(warehouseId),
  });
  return (
    <Card>
      <CardHeader className="pb-2 px-4">
        <CardTitle className="text-base">Out-of-Stock Products</CardTitle>
        <CardDescription className="text-xs leading-snug">
          Number of products currently out of stock.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-4 px-4">
        <div className="text-3xl font-bold min-h-10 flex items-center">
          {isLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : error ? (
            <span className="text-destructive">Error</span>
          ) : (
            formatNumberShort(data ?? 0)
          )}
        </div>
      </CardContent>
    </Card>
  );
}
