import * as React from 'react';
import warehouseService from '@/services/warehouse.service';
import productService from '@/services/product.service';
import { getDefaultDates } from '@/lib/getDefaultDates';

export function useTransactionFilters() {
  const [warehouseId, setWarehouseId] = React.useState('');
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
        const data = await productService.listPaginated({
          page: 1,
          limit: 10,
          search: productSearch.trim(),
          warehouse: warehouseId,
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
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [productSearch, warehouseId]);

  return {
    warehouseId,
    onWarehouseIdChange: setWarehouseId,
    warehouseOptions,
    productId,
    onProductIdChange: setProductId,
    productSearch,
    onProductSearchChange: setProductSearch,
    productOptions,
    productLoading,
    startDate,
    onStartDateChange: setStartDate,
    endDate,
    onEndDateChange: setEndDate,
  };
}
