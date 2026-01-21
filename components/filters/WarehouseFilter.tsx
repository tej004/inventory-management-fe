import { useQuery } from '@tanstack/react-query';
import warehouseService from '@/services/warehouse.service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function WarehouseFilter({
  value,
  onChange,
}: {
  value?: string;
  onChange: (id: string) => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['warehouses'],
    queryFn: warehouseService.list,
  });
  const warehouses = data || [];
  return (
    <Select value={value || 'all'} onValueChange={onChange}>
      <SelectTrigger className="w-56">
        <SelectValue
          placeholder={isLoading ? 'Loading...' : 'All Warehouses'}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Warehouses</SelectItem>
        {warehouses?.map((w: any) => (
          <SelectItem key={w.uuid} value={w.uuid}>
            {w.code}{' '}
            <span className="text-xs text-muted-foreground">{w.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
