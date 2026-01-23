import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import warehouseService from '@/services/warehouse.service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ProductFilter from '@/components/filters/ProductFilter';
import productService from '@/services/product.service';

interface TransferFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    productId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    quantity: number;
  }) => void;
  loading?: boolean;
}

export default function TransferFormModal({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: TransferFormModalProps) {
  const [productId, setProductId] = React.useState('');
  const [productSearch, setProductSearch] = React.useState('');
  const [productOptions, setProductOptions] = React.useState<any[]>([]);
  const [productLoading, setProductLoading] = React.useState(false);
  const [fromWarehouseId, setFromWarehouseId] = React.useState('');
  const [toWarehouseId, setToWarehouseId] = React.useState('');
  const { data: warehouses = [], isLoading: warehousesLoading } = useQuery({
    queryKey: ['warehouses'],
    queryFn: warehouseService.list,
  });
  const [quantity, setQuantity] = React.useState<number | ''>('');

  React.useEffect(() => {
    if (productSearch.trim().length < 2) {
      setProductOptions([]);
      setProductLoading(false);
      return;
    }
    let cancelled = false;
    setProductLoading(true);
    productService
      .search(productSearch)
      .then((data) => {
        if (!cancelled) setProductOptions(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        if (!cancelled) setProductLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !fromWarehouseId || !toWarehouseId || !quantity) return;
    onSubmit({
      productId,
      fromWarehouseId,
      toWarehouseId,
      quantity: Number(quantity),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Form</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Product
            </label>
            <ProductFilter
              productId={productId}
              onProductIdChange={setProductId}
              productSearch={productSearch}
              onProductSearchChange={setProductSearch}
              productOptions={productOptions}
              productLoading={productLoading}
              showAllOption={false}
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-medium text-muted-foreground">
                From Warehouse
              </label>
              <Select
                value={fromWarehouseId}
                onValueChange={setFromWarehouseId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      warehousesLoading ? 'Loading...' : 'Select warehouse'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w: any) => (
                    <SelectItem key={w.uuid} value={w.uuid}>
                      {w.code}{' '}
                      <span className="text-xs text-muted-foreground">
                        {w.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-medium text-muted-foreground">
                To Warehouse
              </label>
              <Select value={toWarehouseId} onValueChange={setToWarehouseId}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      warehousesLoading ? 'Loading...' : 'Select warehouse'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w: any) => (
                    <SelectItem key={w.uuid} value={w.uuid}>
                      {w.code}{' '}
                      <span className="text-xs text-muted-foreground">
                        {w.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Quantity
            </label>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Transfer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
