'use client';

import * as React from 'react';
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
import { toast } from 'sonner';
import warehouseService, { Warehouse } from '@/services/warehouse.service';

export interface WarehouseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
  warehouse?: Warehouse | null; // when passed, modal will update name and location
}

export default function WarehouseModal({
  open,
  onOpenChange,
  onSaved,
  warehouse = null,
}: WarehouseModalProps) {
  const [name, setName] = React.useState(warehouse?.name ?? '');
  const [code, setCode] = React.useState(warehouse?.code ?? '');
  const [location, setLocation] = React.useState(warehouse?.location ?? '');
  const [loading, setLoading] = React.useState(false);

  const CODE_REGEX = /^[A-Za-z]+-\d+$/;
  const codeValid = React.useMemo(() => CODE_REGEX.test(code), [code]);

  React.useEffect(() => {
    if (open) {
      setName(warehouse?.name ?? '');
      setCode(warehouse?.code ?? '');
      setLocation(warehouse?.location ?? '');
    }
  }, [open, warehouse]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (warehouse && warehouse.uuid) {
        // update name and location only
        const res = await warehouseService.update(warehouse.uuid, {
          ...warehouse,
          name,
          location,
        });
        if (!res) {
          toast.error('Failed to update warehouse');
          return;
        }
        toast.success((res as any)?.message ?? 'Warehouse updated');
      } else {
        const payload: Warehouse = {
          name,
          location: location ?? '',
          code: code ?? '',
        };
        const res = await warehouseService.create(payload);
        if (!res) {
          toast.error('Failed to create warehouse');
          return;
        }
        toast.success((res as any)?.message ?? 'Warehouse created');
      }
      onOpenChange(false);
      onSaved?.();
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>
            {warehouse ? 'Edit Warehouse' : 'Create Warehouse'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Warehouse name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {!warehouse && (
            <div>
              <Input
                placeholder="Code (e.g. ABC-123)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              {code.length > 0 && !codeValid && (
                <p className="text-xs text-destructive mt-1">
                  Code must be LETTERS-NUMBERS with a hyphen, e.g. ABC-123
                </p>
              )}
            </div>
          )}
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <DialogFooter className="flex gap-2 justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading || !name.trim() || (!warehouse && !codeValid)}
            >
              {loading
                ? warehouse
                  ? 'Saving...'
                  : 'Creating...'
                : warehouse
                  ? 'Save'
                  : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
