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
import { IconShieldCheck } from '@tabler/icons-react';
import stockService from '@/services/stock.service';

export default function StockCard() {
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['stockRefillStats'],
    queryFn: stockService.refillStats,
    staleTime: 15000,
  });

  const uniqueProducts = stats?.uniqueProducts ?? 0;
  const totalToRefill = stats?.totalToRefill ?? 0;
  const isUp = totalToRefill >= 0;

  function formatNumber(n: number): string {
    if (Math.abs(n) >= 1_000_000_000) {
      return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    } else if (Math.abs(n) >= 1_000_000) {
      return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (Math.abs(n) >= 1_000) {
      return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
      return n.toString();
    }
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Products needing refill</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {isLoading
            ? 'Loading...'
            : isError
              ? 'Error'
              : uniqueProducts.toLocaleString()}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {isLoading
            ? 'Loading trend...'
            : isError
              ? 'Error loading trend'
              : totalToRefill === 0
                ? 'No products need for refill'
                : `${formatNumber(totalToRefill)} stocks need to be filled`}
          <IconShieldCheck
            className={`size-4 ${totalToRefill === 0 ? 'text-green-600' : 'text-red-600'}`}
            aria-label={totalToRefill === 0 ? 'Healthy' : 'Needs refill'}
          />
        </div>
        <div className="text-muted-foreground">Stocks below reorder point</div>
      </CardFooter>
    </Card>
  );
}
