import { api } from '../lib/api';

export interface Warehouse {
  uuid?: string;
  name: string;
  location: string;
  code: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedParams {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
  deletedOnly?: boolean;
  [key: string]: any;
}

const warehouseService = {
  create: async (data: Warehouse) => {
    try {
      const res = await api.post('/warehouses', data);
      return res.data;
    } catch (error) {
      console.error('Create warehouse error:', error);
      return null;
    }
  },
  list: async () => {
    try {
      const res = await api.get('/warehouses');
      return res.data.data;
    } catch (error) {
      console.error('List warehouses error:', error);
      return null;
    }
  },
  listPaginated: async (params: PaginatedParams) => {
    try {
      const res = await api.get('/warehouses/paginated', { params });
      return res.data.data;
    } catch (error) {
      console.error('Paginated warehouses error:', error);
      return null;
    }
  },
  getOne: async (uuid: string) => {
    try {
      const res = await api.get(`/warehouses/${uuid}`);
      return res.data;
    } catch (error) {
      console.error('Get warehouse error:', error);
      return null;
    }
  },
  update: async (uuid: string, data: Warehouse) => {
    try {
      const res = await api.put(`/warehouses/${uuid}`, data);
      return res.data;
    } catch (error) {
      console.error('Update warehouse error:', error);
      return null;
    }
  },
  delete: async (uuid: string) => {
    try {
      await api.delete(`/warehouses/${uuid}`);
      return true;
    } catch (error) {
      console.error('Delete warehouse error:', error);
      return false;
    }
  },
  totalStats: async () => {
    try {
      const res = await api.get('/warehouses/stats/total');
      console.log(res.data);
      return res.data.data;
    } catch (error) {
      console.error('Total stats error:', error);
      return null;
    }
  },
  deletedStats: async () => {
    try {
      const res = await api.get('/warehouses/stats/deleted');
      return res.data;
    } catch (error) {
      console.error('Deleted stats error:', error);
      return null;
    }
  },
};

export default warehouseService;
