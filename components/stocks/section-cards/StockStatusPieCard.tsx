'use client';

import * as React from 'react';
import { Pie, PieChart, Sector, Label } from 'recharts';
import { type PieSectorDataItem } from 'recharts/types/polar/Pie';
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

export interface StockStatusPieCardProps {
  warehouseId?: string;
}

const chartConfig = {
  inStock: { label: 'In Stock', color: 'var(--chart-1)' },
  lowStock: { label: 'Low Stock', color: 'var(--chart-2)' },
} satisfies ChartConfig;

export function StockStatusPieCard({ warehouseId }: StockStatusPieCardProps) {
  const id = 'stock-status-pie';
  const { data, isLoading, isError } = useQuery({
    queryKey: ['stockStatusPie', warehouseId],
    queryFn: () =>
      stockService.stockStatusPie(
        warehouseId ? { warehouse: warehouseId } : {}
      ),
  });

  const pieData = React.useMemo(() => {
    let arr = [];
    if (Array.isArray(data)) {
      arr = data;
    } else if (data && Array.isArray(data.data)) {
      arr = data.data;
    }
    return arr.map((item: any) => ({
      status: item.status,
      count: item.value,
      fill: chartConfig[item.status as keyof typeof chartConfig]?.color,
    }));
  }, [data]);

  const [activeStatus, setActiveStatus] = React.useState('all');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const statuses = React.useMemo(
    () => ['all', ...pieData.map((item: any) => item.status)],
    [pieData]
  );
  const activeIndex = React.useMemo(() => {
    if (activeStatus === 'all') return -1;
    return pieData.findIndex((item: any) => item.status === activeStatus);
  }, [activeStatus, pieData]);

  return (
    <Card data-chart={id} className="flex flex-col h-full min-h-85">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Stock Status</CardTitle>
          <CardDescription>Distribution by status</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-auto h-7 w-32.5 rounded-lg pl-2.5 border text-sm text-left">
              {activeStatus === 'all'
                ? 'All'
                : chartConfig[activeStatus as keyof typeof chartConfig]
                    ?.label || activeStatus}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 p-0">
            <DropdownMenuItem
              onSelect={() => setActiveStatus('all')}
              className={activeStatus === 'all' ? 'font-bold' : ''}
            >
              All
            </DropdownMenuItem>
            {pieData.map((item: any) => (
              <DropdownMenuItem
                key={item.status}
                onSelect={() => setActiveStatus(item.status)}
                className={activeStatus === item.status ? 'font-bold' : ''}
              >
                {chartConfig[item.status as keyof typeof chartConfig]?.label ||
                  item.status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center items-center pb-0 min-h-55">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            Loading...
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center w-full h-full text-destructive">
            Error loading chart
          </div>
        ) : (
          <ChartContainer
            id={id}
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-65 min-w-45"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={pieData}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={activeIndex}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 10} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 25}
                      innerRadius={outerRadius + 12}
                    />
                  </g>
                )}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      let value = 0;
                      let label = '';
                      if (activeStatus === 'all') {
                        value = pieData.reduce(
                          (sum: number, item: { count: number }) =>
                            sum + (item.count || 0),
                          0
                        );
                        label = 'All';
                      } else {
                        value = pieData[activeIndex]?.count ?? 0;
                        label =
                          chartConfig[activeStatus as keyof typeof chartConfig]
                            ?.label || activeStatus;
                      }
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {value.toLocaleString?.() ?? 0}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {label}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
