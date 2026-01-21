import * as React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
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
import transactionService from '@/services/transaction.service';
import { useInvalidateTransactionPage } from '../hooks/useInvalidateTransactionPage';

export type TransactionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editing: any | null;
};

export default function TransactionModal({
  open,
  onOpenChange,
  onSuccess,
  editing,
}: TransactionModalProps) {
  const isEdit = !!editing;
  const invalidateTransactionPage = useInvalidateTransactionPage();
  const [stockId, setStockId] = React.useState(editing?.stockId || '');
  const [quantity, setQuantity] = React.useState(
    editing?.quantity ? String(editing.quantity) : ''
  );
  const [reason, setReason] = React.useState(editing?.reason || '');
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (open) {
      setStockId(editing?.stockId || '');
      setQuantity(editing?.quantity ? String(editing.quantity) : '');
      setReason(editing?.reason || '');
      setErrors({});
    }
  }, [open, editing]);

  function validate() {
    const errs: Record<string, string> = {};
    if (!stockId) errs.stockId = 'Stock ID is required';
    if (!quantity) errs.quantity = 'Quantity is required';
    else if (isNaN(Number(quantity)) || Number(quantity) <= 0)
      errs.quantity = 'Quantity must be a positive number';
    if (!reason) errs.reason = 'Reason is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const reasonTypeMap: Record<string, string> = {
        sale: 'out',
        return: 'in',
        restock: 'in',
      };

      const type = reasonTypeMap[reason] || '';
      if (isEdit) {
        const res = await transactionService.update(editing.uuid, {
          stockId,
          type,
          quantity: Number(quantity),
          reason,
        });
        if (res) {
          toast.success('Transaction updated');
          invalidateTransactionPage();
          onSuccess();
        } else {
          toast.error('Failed to update transaction');
        }
      } else {
        const res = await transactionService.create({
          stockId,
          type,
          quantity: Number(quantity),
          reason,
        });
        if (res) {
          toast.success('Transaction created');
          invalidateTransactionPage();
          onSuccess();
        } else {
          toast.error('Failed to create transaction');
        }
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? 'Error creating transaction.'
      );
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
              {isEdit ? 'Edit Transaction' : 'Create Transaction'}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Update the transaction details.'
                : 'Fill in the details to create a new transaction.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Input
              id="stockId"
              value={stockId}
              onChange={(e) => setStockId(e.target.value)}
              placeholder="Stock ID"
              required
            />
            {errors.stockId && (
              <div className="text-xs text-red-500">{errors.stockId}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Input
              id="quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              required
            />
            {errors.quantity && (
              <div className="text-xs text-red-500">{errors.quantity}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger id="reason" aria-label="Reason">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="return">Return</SelectItem>
                <SelectItem value="restock">Restock</SelectItem>
              </SelectContent>
            </Select>
            {errors.reason && (
              <div className="text-xs text-red-500">{errors.reason}</div>
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
                  : 'Create Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
