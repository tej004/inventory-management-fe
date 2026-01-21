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

export default function TotalStockQuantityCard({
  warehouseId,
}: {
  warehouseId?: string;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['totalStockQuantity', warehouseId],
    queryFn: () => stockService.totalStockQuantity(warehouseId),
  });
  return (
    <Card>
      <CardHeader className="pb-2 px-4">
        <CardTitle className="text-base">Total Stock Quantity</CardTitle>
        <CardDescription className="text-xs leading-snug">
          Total quantity of all products in stock.
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
