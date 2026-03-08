export type PackageCategory = 'NORMAL' | 'PREMIUM';
export type PackageStayMode = 'HOURLY' | 'OVERNIGHT' | 'PACKAGE';

export interface PackageItemProduct {
  id: string;
  name: string;
  price: number;
}

export interface PackageItem {
  id: string;
  productId: string;
  product: PackageItemProduct;
  quantity: number;
}

export interface Package {
  id: string;
  name: string;
  description?: string;
  category: PackageCategory;
  stayMode: PackageStayMode;
  totalPrice: number;
  isActive: boolean;
  validFrom?: string;
  validTo?: string;
  items: PackageItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PackageItemInput {
  productId: string;
  quantity: number;
}

export interface CreatePackagePayload {
  name: string;
  description?: string;
  category: PackageCategory;
  stayMode: PackageStayMode;
  totalPrice: number;
  validFrom?: string;
  validTo?: string;
  items: PackageItemInput[];
}

export interface AddPackageItemPayload {
  productId: string;
  quantity: number;
}
