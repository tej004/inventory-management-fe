import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import CurrentMonthSaleCard from './CurrentMonthSaleCard';
import WarehouseCard from './WarehouseCard';
import ProductCard from './ProductCard';
import StockCard from './StockCard';

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <CurrentMonthSaleCard />
      <WarehouseCard />
      <ProductCard />
      <StockCard />
    </div>
  );
}
