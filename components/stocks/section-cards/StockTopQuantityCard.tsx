'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import stockService from '@/services/stock.service';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

export default function StockTopQuantityCard({
  warehouseId,
}: {
  warehouseId?: string;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['productsByQuantityOrder', warehouseId],
    queryFn: () =>
      stockService.productsByQuantityOrder({ warehouse: warehouseId }),
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
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col h-full min-h-85">
      <CardHeader>
        <CardTitle>Top Products by Quantity</CardTitle>
        <CardDescription>Most stocked products</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center items-center min-h-55 overflow-auto">
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
            className="w-full max-w-65 min-w-45 mx-auto"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ left: -20 }}
            >
              <XAxis type="number" dataKey="quantity" hide />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={12}
                axisLine={false}
                width={120}
                tick={({ x, y, payload }) => (
                  <>
                    <title>{payload.value}</title>
                    <text
                      x={x}
                      y={y}
                      fontSize={13}
                      fill="#334155"
                      textAnchor="end"
                      alignmentBaseline="middle"
                      style={{ cursor: 'pointer' }}
                    >
                      {payload.value.length > 20
                        ? payload.value.slice(0, 20) + '...'
                        : payload.value}
                    </text>
                  </>
                )}
              />
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
