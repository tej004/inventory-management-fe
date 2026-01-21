'use client';

import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

import { toast } from 'sonner';
import warehouseService, { Warehouse } from '@/services/warehouse.service';
import productService from '@/services/product.service';
import stockService from '@/services/stock.service';
import { Product } from '@/types/types/product.type';

export interface StockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
  filterByWarehouseId?: string;
}

export default function StockModal({
  open,
  onOpenChange,
  onCreated,
  filterByWarehouseId,
}: StockModalProps) {
  const queryClient = useQueryClient();
  const [productId, setProductId] = React.useState('');
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );
  const [warehouseId, setWarehouseId] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [warehouses, setWarehouses] = React.useState<Warehouse[]>([]);
  const [productOptions, setProductOptions] = React.useState<Product[]>([]);
  const [productSearch, setProductSearch] = React.useState('');
  const [productLoading, setProductLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProductsDebounced = React.useCallback(
    (q: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }

      const trimmed = q.trim();
      if (trimmed.length < 2) {
        setProductOptions([]);
        setProductLoading(false);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setProductLoading(true);
        try {
          const data = await productService.listPaginated({
            page: 1,
            limit: 10,
            search: trimmed,
            warehouse: filterByWarehouseId,
          });

          if (Array.isArray(data)) setProductOptions(data);
          else if (data?.data && Array.isArray(data.data))
            setProductOptions(data.data);
          else setProductOptions([]);
        } finally {
          setProductLoading(false);
        }
        debounceRef.current = null;
      }, 400);
    },
    [filterByWarehouseId]
  );

  React.useEffect(() => {
    if (open) {
      setProductId('');
      setWarehouseId('');
      setQuantity('');
      setSelectedProduct(null);
      warehouseService.list().then((data) => {
        if (Array.isArray(data)) setWarehouses(data);
      });
    } else {
      // clear any pending search timeout when modal closes
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      setProductOptions([]);
      setProductLoading(false);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await stockService.create({
        productId,
        warehouseId,
        quantity: Number(quantity),
      });

      if (result && (result as any).error) {
        toast.error((result as any).error || 'Failed to create stock.');
        return result;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['totalInventoryValue'] }),
        queryClient.invalidateQueries({ queryKey: ['outOfStockProductCount'] }),
        queryClient.invalidateQueries({
          queryKey: ['productsByQuantityOrder'],
        }),
        queryClient.invalidateQueries({ queryKey: ['inactiveProductCount'] }),
        queryClient.invalidateQueries({ queryKey: ['stockStatusPie'] }),
        queryClient.invalidateQueries({ queryKey: ['activeProductCount'] }),
        queryClient.invalidateQueries({ queryKey: ['totalStockQuantity'] }),
        queryClient.invalidateQueries({ queryKey: ['stockAreaChart'] }),
        queryClient.invalidateQueries({ queryKey: ['warehouses'] }),
      ]);

      toast.success((result as any)?.message ?? 'Stock created successfully!');
      onOpenChange(false);
      onCreated?.();
      return result;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        'Failed to create stock.';
      toast.error(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Create New Stock</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Product search input and dropdown */}
          <div>
            <Input
              placeholder="Search product by SKU or name..."
              value={
                selectedProduct
                  ? `${selectedProduct.sku} - ${selectedProduct.name}`
                  : productSearch
              }
              onChange={(e) => {
                const v = e.target.value;
                setProductSearch(v);
                setSelectedProduct(null);
                setProductId('');
                fetchProductsDebounced(v);
              }}
              autoComplete="off"
            />
            {productSearch && !selectedProduct && (
              <div className="border rounded bg-background mt-1 max-h-40 overflow-y-auto z-50 relative">
                {productLoading ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : productOptions.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No products found.
                  </div>
                ) : (
                  productOptions.map((product) => (
                    <div
                      key={product.uuid}
                      className={`px-3 py-2 cursor-pointer hover:bg-accent ${productId === product.uuid ? 'bg-accent' : ''}`}
                      onClick={() => {
                        // select product and clear pending search
                        if (debounceRef.current) {
                          window.clearTimeout(debounceRef.current);
                          debounceRef.current = null;
                        }
                        setProductId(product.uuid || '');
                        setSelectedProduct(product);
                        setProductSearch('');
                        setProductOptions([]);
                        setProductLoading(false);
                      }}
                    >
                      <span className="font-medium">{product.sku}</span>{' '}
                      <span className="text-xs text-muted-foreground">
                        {product.name}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          {/* Warehouse dropdown */}
          <Select value={warehouseId} onValueChange={setWarehouseId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select warehouse" />
            </SelectTrigger>
            <SelectContent>
              {warehouses.map((w) => (
                <SelectItem key={w.uuid} value={w.uuid || ''}>
                  {w.code}{' '}
                  <span className="text-xs text-muted-foreground">
                    {w.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min={0}
          />
          <DialogFooter className="flex gap-2 justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="default"
              disabled={
                loading ||
                !warehouseId ||
                !productId ||
                !quantity ||
                isNaN(Number(quantity)) ||
                Number(quantity) < 0
              }
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
