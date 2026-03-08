export type ProductCategory =
  | 'BEVERAGE_WATER'
  | 'BEVERAGE_ENERGY'
  | 'BEVERAGE_ALCOHOL'
  | 'SNACK_CANDY'
  | 'SNACK_SAVORY';

export type ProductStatus = 'ACTIVE' | 'DISCONTINUED';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  minStock: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  category: ProductCategory;
  price: number;
  stock?: number;
  minStock?: number;
}

export interface UpdateStockPayload {
  stock: number;
}
