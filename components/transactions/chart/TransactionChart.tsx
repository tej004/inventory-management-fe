'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import transactionService from '@/services/transaction.service';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface TransactionChartProps {
  warehouseId?: string;
  productId?: string;
  startDate: string;
  endDate: string;
}

export default function TransactionChart({
  warehouseId,
  productId,
  startDate,
  endDate,
}: TransactionChartProps) {
  const {
    data: chartData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['dailySalesChart', warehouseId, productId, startDate, endDate],
    queryFn: () =>
      transactionService.dailySalesChart({
        warehouseId,
        productId,
        startDate,
        endDate,
      }),
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Transaction Sales Chart</CardTitle>
        <CardDescription>
          Daily sales value for the selected period.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            Loading chart...
          </div>
        ) : isError ? (
          <div className="flex h-[250px] items-center justify-center text-destructive">
            Failed to load chart data.
          </div>
        ) : (
          <ChartContainer
            config={{ totalSales: { label: 'Total Sales' } }}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData || []}>
              <defs>
                <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-primary)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={60}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                type="natural"
                dataKey="totalSales"
                name="Total Sales"
                stroke="var(--color-primary)"
                fill="url(#fillPrimary)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
