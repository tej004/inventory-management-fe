'use client';
import * as React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import PendingTransfersTab from '../tabs/PendingTransfersTab';
import ApprovedTransfersTab from '../tabs/ApprovedTransfersTab';
import ReceivedTransfersTab from '../tabs/ReceivedTransfersTab';
import RejectedTransfersTab from '../tabs/RejectedTransfersTab';
import WarehouseFilter from '../../filters/WarehouseFilter';
import ProductFilter from '../../filters/ProductFilter';
import { Button } from '@/components/ui/button';
import transferService from '@/services/transfer.service';
import { toast } from 'sonner';
import TransferFormModal from '../modal/TransferFormModal';
import { useInvalidateTransferPage } from '@/components/transactions/hooks/useInvalidateTransferPage';
import useTransferFilters from '../hooks/useTransferFilters';

export default function ContentContainer() {
  const {
    fromWarehouseId,
    setFromWarehouseId,
    toWarehouseId,
    setToWarehouseId,
    productId,
    setProductId,
    productSearch,
    setProductSearch,
    productOptions,
    productLoading,
  } = useTransferFilters();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const invalidateTransferPage = useInvalidateTransferPage();

  const handleCreateTransfer = async (data: {
    productId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    quantity: number;
  }) => {
    setCreating(true);
    try {
      await transferService.create(data);
      await invalidateTransferPage();
      toast.success('Transfer created successfully!');
      setModalOpen(false);
    } catch (err: any) {
      let message = 'Failed to create transfer.';
      if (err?.response?.data?.message) {
        message = Array.isArray(err.response.data.message)
          ? err.response.data.message.join(', ')
          : err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      }
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-full min-w-0">
      <div className="flex gap-4 mb-2 items-end">
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-medium text-muted-foreground">
            From Warehouse
          </label>
          <WarehouseFilter
            value={fromWarehouseId}
            onChange={setFromWarehouseId}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-medium text-muted-foreground">
            To Warehouse
          </label>
          <WarehouseFilter value={toWarehouseId} onChange={setToWarehouseId} />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-medium text-muted-foreground">
            Product
          </label>
          <ProductFilter
            productId={productId}
            onProductIdChange={setProductId}
            productSearch={productSearch}
            onProductSearchChange={setProductSearch}
            productOptions={productOptions}
            productLoading={productLoading}
            showAllOption={true}
          />
        </div>
        <Button onClick={() => setModalOpen(true)} size="sm">
          Create Transfer
        </Button>
      </div>
      <TransferFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleCreateTransfer}
        loading={creating}
      />
      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <PendingTransfersTab
            fromWarehouseId={
              fromWarehouseId === 'all' ? undefined : fromWarehouseId
            }
            toWarehouseId={toWarehouseId === 'all' ? undefined : toWarehouseId}
            productId={productId}
          />
        </TabsContent>
        <TabsContent value="approved">
          <ApprovedTransfersTab
            fromWarehouseId={
              fromWarehouseId === 'all' ? undefined : fromWarehouseId
            }
            toWarehouseId={toWarehouseId === 'all' ? undefined : toWarehouseId}
            productId={productId}
          />
        </TabsContent>
        <TabsContent value="received">
          <ReceivedTransfersTab
            fromWarehouseId={
              fromWarehouseId === 'all' ? undefined : fromWarehouseId
            }
            toWarehouseId={toWarehouseId === 'all' ? undefined : toWarehouseId}
            productId={productId}
          />
        </TabsContent>
        <TabsContent value="rejected">
          <RejectedTransfersTab
            fromWarehouseId={
              fromWarehouseId === 'all' ? undefined : fromWarehouseId
            }
            toWarehouseId={toWarehouseId === 'all' ? undefined : toWarehouseId}
            productId={productId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
