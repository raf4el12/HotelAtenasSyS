import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import type { IProductRepository, CreateProductData, UpdateProductData } from '../../domain/repositories/product.repository.js';
import { ProductEntity } from '../../domain/entities/product.entity.js';
import type { ProductCategory } from '../../../../shared/domain/enums/product-category.enum.js';
import type { ProductStatus } from '../../../../shared/domain/enums/product-status.enum.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

function mapToProductEntity(prismaProduct: any): ProductEntity {
    const product = new ProductEntity();
    product.id = prismaProduct.id;
    product.name = prismaProduct.name;
    product.category = prismaProduct.category;
    product.price = Number(prismaProduct.price);
    product.stock = prismaProduct.stock;
    product.minStock = prismaProduct.minStock;
    product.status = prismaProduct.status;
    product.createdAt = prismaProduct.createdAt;
    product.updatedAt = prismaProduct.updatedAt;
    return product;
}

@Injectable()
export class PrismaProductRepository implements IProductRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<ProductEntity | null> {
        const product = await this.prisma.product.findUnique({ where: { id } });
        return product ? mapToProductEntity(product) : null;
    }

    async create(data: CreateProductData): Promise<ProductEntity> {
        const product = await this.prisma.product.create({ data });
        return mapToProductEntity(product);
    }

    async findAllPaginated(
        params: PaginationParams,
        filters?: { category?: ProductCategory; status?: ProductStatus },
    ): Promise<PaginatedResult<ProductEntity>> {
        const where: any = {
            ...(filters?.category && { category: filters.category }),
            ...(filters?.status && { status: filters.status }),
            ...(params.searchValue && {
                name: { contains: params.searchValue, mode: 'insensitive' },
            }),
        };

        const orderByField = params.orderBy ?? 'name';
        const orderByMode = (params.orderByMode as 'asc' | 'desc') ?? 'asc';

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip: params.offset,
                take: params.limit,
                orderBy: { [orderByField]: orderByMode },
            }),
            this.prisma.product.count({ where }),
        ]);

        return {
            totalRows: total,
            rows: products.map(mapToProductEntity),
            totalPages: Math.ceil(total / params.limit),
            currentPage: Math.floor(params.offset / params.limit) + 1,
        };
    }

    async update(id: string, data: UpdateProductData): Promise<ProductEntity> {
        const product = await this.prisma.product.update({ where: { id }, data });
        return mapToProductEntity(product);
    }

    async updateStock(id: string, stock: number): Promise<ProductEntity> {
        const product = await this.prisma.product.update({
            where: { id },
            data: { stock },
        });
        return mapToProductEntity(product);
    }

    async findLowStock(): Promise<ProductEntity[]> {
        const products = await this.prisma.$queryRaw<any[]>`
      SELECT * FROM products
      WHERE stock <= min_stock AND status = 'ACTIVE'
      ORDER BY stock ASC
    `;
        return products.map((row) => {
            const mapped: any = {
                id: row.id,
                name: row.name,
                category: row.category,
                price: row.price,
                stock: row.stock,
                minStock: row.min_stock,
                status: row.status,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            };
            return mapToProductEntity(mapped);
        });
    }
}
