import { api } from '../lib/api';

const transferService = {
  create: async (data: {
    productId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    quantity: number;
  }) => {
    const res = await api.post('/transfers', data);
    return res.data.data;
  },
  receive: async (uuid: string) => {
    const res = await api.post(`/transfers/${uuid}/receive`);
    return res.data.data;
  },
  approve: async (uuid: string) => {
    const res = await api.post(`/transfers/${uuid}/approve`);
    return res.data.data;
  },
  decline: async (uuid: string) => {
    const res = await api.post(`/transfers/${uuid}/decline`);
    return res.data.data;
  },
  listPaginated: async (params: {
    page?: number;
    limit?: number;
    productId?: string;
    fromWarehouseId?: string;
    toWarehouseId?: string;
    approvalStatus?: string;
  }) => {
    const res = await api.get('/transfers/paginated', { params });
    return res.data.data;
  },
};

export default transferService;
