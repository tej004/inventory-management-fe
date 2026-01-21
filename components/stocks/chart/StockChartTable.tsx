'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
} from 'recharts';
import stockService from '@/services/stock.service';

export default function StockChartTable({
  warehouseId,
}: {
  warehouseId?: string;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['stockAreaChart', warehouseId],
    queryFn: () =>
      stockService.stockAreaChart(
        warehouseId ? { warehouse: warehouseId } : {}
      ),
  });

  const rows: Array<{ stockName?: string; stock?: number }> = Array.isArray(
    data
  )
    ? data
    : data && Array.isArray((data as any).data)
      ? (data as any).data
      : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stocks Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div className="text-destructive">Failed to load stocks summary</div>
        ) : rows.length === 0 ? (
          <div className="text-center">No data</div>
        ) : (
          <ChartContainer config={{}} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rows.map((r) => ({
                  name: r.stockName ?? '-',
                  value: r.stock ?? 0,
                }))}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="value" fill="var(--chart-1)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
