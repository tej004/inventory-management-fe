'use client';

import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import stockService from '@/services/stock.service';
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
  type ChartConfig,
} from '@/components/ui/chart';

export default function StockLowQuantityCard({
  warehouseId,
}: {
  warehouseId?: string;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['productsByQuantityOrder', warehouseId, 'asc'],
    queryFn: () =>
      stockService.productsByQuantityOrder({
        warehouse: warehouseId,
        order: 'asc',
      }),
  });

  // Data: Array<{ productId: string; productName: string; totalQuantity: number }>
  const chartData = Array.isArray(data)
    ? data.map((item) => ({
        name: item.productName,
        quantity: item.totalQuantity,
      }))
    : [];

  const chartConfig = {
    quantity: {
      label: 'Quantity',
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col h-full min-h-[340px]">
      <CardHeader>
        <CardTitle>Lowest Products by Quantity</CardTitle>
        <CardDescription>Least stocked products</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center items-center min-h-[220px] overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-32">
            Loading...
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center w-full h-32 text-destructive">
            Error loading chart
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="w-full max-w-[260px] min-w-[180px] mx-auto"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="horizontal"
              margin={{ bottom: 20 }}
            >
              <XAxis
                type="category"
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 16)}
              />
              <YAxis type="number" dataKey="quantity" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="quantity" fill="var(--color-quantity)" radius={5} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
