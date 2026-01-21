import * as React from 'react';
import warehouseService from '@/services/warehouse.service';
import productService from '@/services/product.service';
import { getDefaultDates } from '@/lib/getDefaultDates';

function useTransferFilters() {
  const [fromWarehouseId, setFromWarehouseId] = React.useState('');
  const [toWarehouseId, setToWarehouseId] = React.useState('');
  const [productId, setProductId] = React.useState('');
  const [productSearch, setProductSearch] = React.useState('');
  const [productOptions, setProductOptions] = React.useState<
    Array<{ uuid: string; sku: string; name: string }>
  >([]);
  const [productLoading, setProductLoading] = React.useState(false);
  const { startDate: defaultStartDate, endDate: defaultEndDate } =
    getDefaultDates();
  const [startDate, setStartDate] = React.useState(defaultStartDate);
  const [endDate, setEndDate] = React.useState(defaultEndDate);
  const [warehouseOptions, setWarehouseOptions] = React.useState<
    Array<{ uuid: string; code: string; name: string }>
  >([]);

  React.useEffect(() => {
    warehouseService.list().then((data) => {
      if (Array.isArray(data)) setWarehouseOptions(data);
    });
  }, []);

  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    if (productSearch.trim().length < 2) {
      setProductOptions([]);
      setProductLoading(false);
      return;
    }
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setProductLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await productService.search(productSearch);
        setProductOptions(Array.isArray(data) ? data : []);
      } finally {
        setProductLoading(false);
      }
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSearch]);

  return {
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
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    warehouseOptions,
  };
}

export default useTransferFilters;
