import { api } from '../lib/api';

export interface PaginatedParams {
  page?: number;
  limit?: number;
  [key: string]: any;
}

const transactionService = {
  create: async (data: Partial<any>): Promise<any | null> => {
    try {
      const res = await api.post('/transactions', data);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  list: async (): Promise<any[] | null> => {
    try {
      const res = await api.get('/transactions');
      return res.data;
    } catch (error) {
      console.error('List transactions error:', error);
      return null;
    }
  },
  listPaginated: async (params: PaginatedParams): Promise<any> => {
    try {
      const res = await api.get('/transactions/paginated', { params });
      return res.data.data;
    } catch (error) {
      console.error('Paginated transactions error:', error);
      return null;
    }
  },
  getOne: async (uuid: string): Promise<any | null> => {
    try {
      const res = await api.get(`/transactions/${uuid}`);
      return res.data;
    } catch (error) {
      console.error('Get transaction error:', error);
      return null;
    }
  },
  update: async (uuid: string, data: Partial<any>): Promise<any | null> => {
    try {
      const res = await api.put(`/transactions/${uuid}`, data);
      return res.data;
    } catch (error) {
      console.error('Update transaction error:', error);
      return null;
    }
  },
  delete: async (uuid: string): Promise<boolean> => {
    try {
      await api.delete(`/transactions/${uuid}`);
      return true;
    } catch (error) {
      console.error('Delete transaction error:', error);
      return false;
    }
  },
  monthlySalesStats: async (): Promise<any> => {
    try {
      const res = await api.get('/transactions/stats/monthly-sales');
      return res.data.data;
    } catch (error) {
      console.error('Monthly sales stats error:', error);
      return null;
    }
  },
  dailyWarehouseSales: async (params?: any): Promise<any> => {
    try {
      const res = await api.get('/transactions/stats/daily-warehouse-sales', {
        params,
      });
      return res.data.data;
    } catch (error) {
      console.error('Daily warehouse sales error:', error);
      return null;
    }
  },

  totalTransactionValue: async (params: {
    warehouseId?: string;
    productId?: string;
    startDate: string;
    endDate: string;
    reason?: string;
  }): Promise<number | null> => {
    try {
      const res = await api.get('/transactions/stats/total-transaction-value', {
        params,
      });
      return res.data.data;
    } catch (error) {
      console.error('Total transaction value error:', error);
      return null;
    }
  },

  totalSalesValueAllTime: async (params: {
    warehouseId?: string;
    productId?: string;
  }): Promise<number | null> => {
    try {
      const res = await api.get(
        '/transactions/stats/total-sales-value-all-time',
        { params }
      );
      return res.data.data;
    } catch (error) {
      console.error('Total sales value (all time) error:', error);
      return null;
    }
  },

  dailySalesChart: async (params: {
    warehouseId?: string;
    productId?: string;
    startDate: string;
    endDate: string;
  }): Promise<Array<{ date: string; totalSales: number }> | null> => {
    try {
      const res = await api.get('/transactions/stats/daily-sales-chart', {
        params,
      });
      return res.data.data;
    } catch (error) {
      console.error('Daily sales chart error:', error);
      return null;
    }
  },
};

export default transactionService;
