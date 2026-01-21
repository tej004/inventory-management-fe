import { api } from '../lib/api';

export interface Stock {
  uuid?: string;
  productId: string;
  warehouseId: string;
  quantity: number;
}

export interface PaginatedParams {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
  deletedOnly?: boolean;
  category?: string;
  status?: string;
  warehouse?: string;
  [key: string]: any;
}

const stockService = {
  create: async (data: Stock) => {
    try {
      const res = await api.post('/stocks', data);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  list: async () => {
    try {
      const res = await api.get('/stocks');
      return res.data;
    } catch (error) {
      console.error('List stocks error:', error);
      return null;
    }
  },
  listPaginated: async (params: PaginatedParams) => {
    try {
      const res = await api.get('/stocks/paginated', { params });
      return res.data.data;
    } catch (error) {
      console.error('Paginated stocks error:', error);
      return null;
    }
  },
  getOne: async (uuid: string) => {
    try {
      const res = await api.get(`/stocks/${uuid}`);
      return res.data;
    } catch (error) {
      console.error('Get stock error:', error);
      return null;
    }
  },
  update: async (uuid: string, data: Stock) => {
    try {
      const res = await api.put(`/stocks/${uuid}`, data);
      return res.data;
    } catch (error) {
      console.error('Update stock error:', error);
      return null;
    }
  },
  delete: async (uuid: string) => {
    try {
      await api.delete(`/stocks/${uuid}`);
      return true;
    } catch (error) {
      console.error('Delete stock error:', error);
      return false;
    }
  },
  refillStats: async () => {
    try {
      const res = await api.get('/stocks/stats/refill');
      return res.data.data;
    } catch (error) {
      console.error('Refill stats error:', error);
      return null;
    }
  },
  stockStatusPie: async (params?: { warehouse?: string }) => {
    try {
      const res = await api.get('/stocks/stats/stock-status-pie', { params });
      return res.data.data;
    } catch (error) {
      console.error('Stock status pie error:', error);
      return null;
    }
  },
  productsByQuantityOrder: async (params?: {
    limit?: number;
    warehouse?: string;
    order?: string;
  }) => {
    try {
      const res = await api.get('/stocks/stats/products-by-quantity-order', {
        params,
      });
      return res.data.data;
    } catch (error) {
      console.error('Products by quantity order error:', error);
      return null;
    }
  },
  stockAreaChart: async (params?: { warehouse?: string }) => {
    try {
      const res = await api.get('/stocks/stats/area-chart', {
        params,
      });
      return res.data.data;
    } catch (error) {
      return null;
    }
  },
  totalStockQuantity: async (warehouseId?: string) => {
    try {
      const res = await api.get('/stocks/stats/total-stock-quantity', {
        params: warehouseId ? { warehouseId } : undefined,
      });
      return res.data.data;
    } catch (error) {
      console.error('Total stock quantity error:', error);
      return null;
    }
  },
  totalInventoryValue: async (warehouseId?: string) => {
    try {
      const res = await api.get('/stocks/stats/total-inventory-value', {
        params: warehouseId ? { warehouseId } : undefined,
      });
      return res.data.data;
    } catch (error) {
      console.error('Total inventory value error:', error);
      return null;
    }
  },
  outOfStockProductCount: async (warehouseId?: string) => {
    try {
      const res = await api.get('/stocks/stats/out-of-stock-product-count', {
        params: warehouseId ? { warehouseId } : undefined,
      });
      return res.data.data;
    } catch (error) {
      console.error('Out-of-stock product count error:', error);
      return null;
    }
  },
  inactiveProductCount: async (warehouseId?: string) => {
    try {
      const res = await api.get('/stocks/stats/inactive-product-count', {
        params: warehouseId ? { warehouseId } : undefined,
      });
      return res.data.data;
    } catch (error) {
      console.error('Inactive product count error:', error);
      return null;
    }
  },
  activeProductCount: async (warehouseId?: string) => {
    try {
      const res = await api.get('/stocks/stats/active-product-count', {
        params: warehouseId ? { warehouseId } : undefined,
      });
      return res.data.data;
    } catch (error) {
      console.error('Active product count error:', error);
      return null;
    }
  },
};

export default stockService;
