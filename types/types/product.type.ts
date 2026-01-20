export type Product = {
  uuid: string;
  sku: string;
  name: string;
  category: string;
  unitCost: number;
  reorderPoint: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};
