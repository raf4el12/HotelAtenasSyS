import type { ProductCategory } from '../../../../shared/domain/enums/product-category.enum.js';
import type { ProductStatus } from '../../../../shared/domain/enums/product-status.enum.js';

export class ProductEntity {
    id: string;
    name: string;
    category: ProductCategory;
    price: number;
    stock: number;
    minStock: number;
    status: ProductStatus;
    createdAt: Date;
    updatedAt: Date;
}
