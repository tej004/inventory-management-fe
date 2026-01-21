import { useQuery } from '@tanstack/react-query';
import stockService from '@/services/stock.service';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
export default function TotalInventoryValueCard({
  warehouseId,
}: {
  warehouseId?: string;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['totalInventoryValue', warehouseId],
    queryFn: () => stockService.totalInventoryValue(warehouseId),
  });
  return (
    <Card>
      <CardHeader className="pb-2 px-4">
        <CardTitle className="text-base">Total Inventory Value</CardTitle>
        <CardDescription className="text-xs leading-snug">
          Monetary value of all inventory in stock.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-4 px-4">
        <div className="text-3xl font-bold min-h-10 flex items-center">
          {isLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : error ? (
            <span className="text-destructive">Error</span>
          ) : data ? (
            `$${data.toLocaleString()}`
          ) : (
            '$0'
          )}
        </div>
      </CardContent>
    </Card>
  );
}
