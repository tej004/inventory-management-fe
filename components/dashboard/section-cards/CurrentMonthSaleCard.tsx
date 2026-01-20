'use client';

import { useQuery } from '@tanstack/react-query';
import transactionService from '@/services/transaction.service';
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

export default function CurrentMonthSaleCard() {
  const {
    data: monthlyStats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['monthlySalesStats'],
    queryFn: transactionService.monthlySalesStats,
    staleTime: 15000,
  });

  const totalSales = monthlyStats?.totalSalesThisMonth ?? 0;
  const growthPercent = monthlyStats?.growthPercent ?? 0;
  const isUp = growthPercent >= 0;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>This Month</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {isLoading
            ? 'Loading...'
            : isError
              ? 'Error'
              : `$${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {isUp ? <IconTrendingUp /> : <IconTrendingDown />}
            {isLoading ? '' : `${isUp ? '+' : ''}${growthPercent.toFixed(1)}%`}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {isLoading
            ? 'Loading trend...'
            : isError
              ? 'Error loading trend'
              : isUp
                ? 'Sale up this month'
                : 'Sale down this month'}{' '}
          {isUp ? (
            <IconTrendingUp className="size-4" />
          ) : (
            <IconTrendingDown className="size-4" />
          )}
        </div>
        <div className="text-muted-foreground">Monthly sales performance</div>
      </CardFooter>
    </Card>
  );
}
