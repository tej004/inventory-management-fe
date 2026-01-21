import * as React from 'react';
import { Product } from '@/types/types/product.type';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import productService from '@/services/product.service';

export type ProductModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editing: Product | null;
};

export default function ProductModal({
  open,
  onOpenChange,
  onSuccess,
  editing,
}: ProductModalProps) {
  const isEdit = !!editing;
  const [sku, setSku] = React.useState(editing?.sku || '');
  const [name, setName] = React.useState(editing?.name || '');
  const [category, setCategory] = React.useState(editing?.category || '');
  const [unitCost, setUnitCost] = React.useState(
    editing?.unitCost ? String(editing.unitCost) : ''
  );
  const [reorderPoint, setReorderPoint] = React.useState(
    editing?.reorderPoint ? String(editing.reorderPoint) : ''
  );
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (open) {
      setSku(editing?.sku || '');
      setName(editing?.name || '');
      setCategory(editing?.category || '');
      setUnitCost(editing?.unitCost ? String(editing.unitCost) : '');
      setReorderPoint(
        editing?.reorderPoint ? String(editing.reorderPoint) : ''
      );
      setErrors({});
    }
    // eslint-disable-next-line
  }, [open, editing]);

  function validate() {
    const errs: Record<string, string> = {};
    if (!sku) errs.sku = 'SKU is required';
    else if (!/^([A-Z]+-[A-Z]+-\d+)$/.test(sku)) errs.sku = 'Format: AAA-BBB-1';
    if (!name) errs.name = 'Name is required';
    else if (name !== name.toUpperCase())
      errs.name = 'Name must be all uppercase letters';
    if (!category) errs.category = 'Category is required';
    if (!unitCost) errs.unitCost = 'Unit cost is required';
    else if (isNaN(Number(unitCost)) || Number(unitCost) <= 0)
      errs.unitCost = 'Must be a positive number';
    if (!reorderPoint) errs.reorderPoint = 'Reorder point is required';
    else if (!/^[0-9]+$/.test(reorderPoint) || Number(reorderPoint) < 0)
      errs.reorderPoint = 'Must be a non-negative integer';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit) {
        const res = await productService.update(editing!.uuid, {
          sku,
          name: name.toUpperCase(),
          category,
          unitCost: Number(unitCost),
          reorderPoint: Number(reorderPoint),
        });
        if (res) {
          toast.success('Product updated');
          onSuccess();
        } else {
          toast.error('Failed to update product');
        }
      } else {
        const res = await productService.create({
          sku,
          name: name.toUpperCase(),
          category,
          unitCost: Number(unitCost),
          reorderPoint: Number(reorderPoint),
        });
        if (res) {
          toast.success('Product created');
          onSuccess();
        } else {
          toast.error('Failed to create product');
        }
      }
    } catch (err: any) {
      toast.error('Error: ' + (err?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Product' : 'Create Product'}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Update the product details.'
                : 'Fill in the details to create a new product.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input
              id="sku"
              value={sku}
              onChange={(e) => {
                let val = e.target.value.toUpperCase();
                val = val.replace(/[^A-Z0-9-]/g, '');
                setSku(val);
              }}
              placeholder="ECO-PKG-1"
              maxLength={20}
              disabled={isEdit}
              required
              pattern="[A-Z]+-[A-Z]+-\d+"
              title="Format: AAA-BBB-1 (letters-letters-number)"
            />
            {errors.sku && (
              <div className="text-xs text-red-500">{errors.sku}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Input
              id="name"
              value={name}
              onChange={(e) =>
                setName(e.target.value.replace(/^\s+/, '').toUpperCase())
              }
              placeholder="Product name"
              required
            />
            {errors.name && (
              <div className="text-xs text-red-500">{errors.name}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              required
            />
            {errors.category && (
              <div className="text-xs text-red-500">{errors.category}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Input
              id="unitCost"
              type="number"
              min="0"
              step="0.01"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              placeholder="Unit cost"
              required
            />
            {errors.unitCost && (
              <div className="text-xs text-red-500">{errors.unitCost}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Input
              id="reorderPoint"
              type="number"
              min="0"
              step="1"
              value={reorderPoint}
              onChange={(e) => setReorderPoint(e.target.value)}
              placeholder="Reorder point"
              required
            />
            {errors.reorderPoint && (
              <div className="text-xs text-red-500">{errors.reorderPoint}</div>
            )}
          </div>
          <DialogFooter className="flex gap-2 mt-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading
                ? 'Saving...'
                : isEdit
                  ? 'Save Changes'
                  : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
