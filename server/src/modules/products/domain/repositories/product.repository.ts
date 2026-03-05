import type { ProductEntity } from '../entities/product.entity.js';
import type { ProductCategory } from '../../../../shared/domain/enums/product-category.enum.js';
import type { ProductStatus } from '../../../../shared/domain/enums/product-status.enum.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

export interface CreateProductData {
    name: string;
    category: ProductCategory;
    price: number;
    stock?: number;
    minStock?: number;
}

export interface UpdateProductData {
    name?: string;
    category?: ProductCategory;
    price?: number;
    minStock?: number;
    status?: ProductStatus;
}

export interface IProductRepository {
    findById(id: string): Promise<ProductEntity | null>;
    create(data: CreateProductData): Promise<ProductEntity>;
    findAllPaginated(
        params: PaginationParams,
        filters?: { category?: ProductCategory; status?: ProductStatus },
    ): Promise<PaginatedResult<ProductEntity>>;
    update(id: string, data: UpdateProductData): Promise<ProductEntity>;
    updateStock(id: string, stock: number): Promise<ProductEntity>;
    findLowStock(): Promise<ProductEntity[]>;
}
