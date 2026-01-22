import { api } from '../lib/api';

export interface Product {
  uuid?: string;
  sku: string;
  name: string;
  category: string;
  unitCost: number;
  reorderPoint: number;
}

export interface PaginatedParams {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
  deletedOnly?: boolean;
  [key: string]: any;
}

const productService = {
  search: async (search: string) => {
    try {
      const res = await api.get('/products/paginated', {
        params: { search, page: 1, limit: 10 },
      });
      return res.data.data.data;
    } catch (error) {
      console.error('Search products error:', error);
      return [];
    }
  },
  create: async (data: Product) => {
    try {
      const res = await api.post('/products', data);
      return res.data;
    } catch (error) {
      console.error('Create product error:', error);
      return null;
    }
  },
  list: async () => {
    try {
      const res = await api.get('/products');
      return res.data;
    } catch (error) {
      console.error('List products error:', error);
      return null;
    }
  },
  listPaginated: async (params: PaginatedParams) => {
    try {
      const res = await api.get('/products/paginated', { params });
      return res.data.data;
    } catch (error) {
      console.error('Paginated products error:', error);
      return null;
    }
  },
  getOne: async (uuid: string) => {
    try {
      const res = await api.get(`/products/${uuid}`);
      return res.data;
    } catch (error) {
      console.error('Get product error:', error);
      return null;
    }
  },
  update: async (uuid: string, data: Product) => {
    try {
      const res = await api.put(`/products/${uuid}`, data);
      return res.data;
    } catch (error) {
      console.error('Update product error:', error);
      return null;
    }
  },
  delete: async (uuid: string) => {
    try {
      await api.delete(`/products/${uuid}`);
      return true;
    } catch (error) {
      console.error('Delete product error:', error);
      return false;
    }
  },
  totalStats: async () => {
    try {
      const res = await api.get('/products/stats/total');
      return res.data.data;
    } catch (error) {
      console.error('Product stats error:', error);
      return null;
    }
  },
};

export default productService;
