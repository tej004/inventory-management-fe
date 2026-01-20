'use client';

import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import warehouseService from '@/services/warehouse.service';

export default function WarehouseCard() {
  const {
    data: monthlyStats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['warehouseTotalStats'],
    queryFn: warehouseService.totalStats,
    staleTime: 15000,
  });

  const total = monthlyStats?.total ?? 0;
  const growth = monthlyStats?.growth ?? 0;
  const isUp = growth >= 0;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Total Warehouse</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {isLoading
            ? 'Loading...'
            : isError
              ? 'Error'
              : total.toLocaleString()}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {isUp ? <IconTrendingUp /> : <IconTrendingDown />}
            {isLoading ? '' : `${isUp ? '+' : ''}${growth.toFixed(1)}%`}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {isLoading
            ? 'Loading trend...'
            : isError
              ? 'Error loading trend'
              : growth === 0
                ? 'No change'
                : isUp
                  ? `+${growth}% added`
                  : `${Math.abs(growth)} removed`}
          {isUp ? (
            <IconTrendingUp className="size-4" />
          ) : (
            <IconTrendingDown className="size-4" />
          )}
        </div>
        <div className="text-muted-foreground">Total active warehouses</div>
      </CardFooter>
    </Card>
  );
}
