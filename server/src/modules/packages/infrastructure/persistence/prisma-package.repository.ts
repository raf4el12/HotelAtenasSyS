import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import type { IPackageRepository, CreatePackageData, UpdatePackageData, PackageItemInput } from '../../domain/repositories/package.repository.js';
import { PackageEntity, PackageItemEntity } from '../../domain/entities/package.entity.js';
import type { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';
import type { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

const itemsInclude = {
    items: {
        include: { product: { select: { id: true, name: true, price: true } } },
    },
};

function mapItemEntity(prismaItem: any): PackageItemEntity {
    const item = new PackageItemEntity();
    item.id = prismaItem.id;
    item.packageId = prismaItem.packageId;
    item.productId = prismaItem.productId;
    item.quantity = prismaItem.quantity;
    item.product = prismaItem.product
        ? { id: prismaItem.product.id, name: prismaItem.product.name, price: Number(prismaItem.product.price) }
        : null;
    return item;
}

function mapToPackageEntity(prismaPkg: any): PackageEntity {
    const pkg = new PackageEntity();
    pkg.id = prismaPkg.id;
    pkg.name = prismaPkg.name;
    pkg.description = prismaPkg.description;
    pkg.category = prismaPkg.category;
    pkg.stayMode = prismaPkg.stayMode;
    pkg.totalPrice = Number(prismaPkg.totalPrice);
    pkg.isActive = prismaPkg.isActive;
    pkg.validFrom = prismaPkg.validFrom;
    pkg.validTo = prismaPkg.validTo;
    pkg.createdAt = prismaPkg.createdAt;
    pkg.updatedAt = prismaPkg.updatedAt;
    pkg.items = prismaPkg.items?.map(mapItemEntity) ?? [];
    return pkg;
}

@Injectable()
export class PrismaPackageRepository implements IPackageRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<PackageEntity | null> {
        const pkg = await this.prisma.package.findUnique({
            where: { id },
            include: itemsInclude,
        });
        return pkg ? mapToPackageEntity(pkg) : null;
    }

    async create(data: CreatePackageData): Promise<PackageEntity> {
        const pkg = await this.prisma.package.create({
            data: {
                name: data.name,
                description: data.description,
                category: data.category,
                stayMode: data.stayMode,
                totalPrice: data.totalPrice,
                validFrom: data.validFrom,
                validTo: data.validTo,
                items: {
                    create: data.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
            },
            include: itemsInclude,
        });
        return mapToPackageEntity(pkg);
    }

    async findAllPaginated(
        params: PaginationParams,
        filters?: { category?: RoomCategory; stayMode?: StayMode; isActive?: boolean },
    ): Promise<PaginatedResult<PackageEntity>> {
        const where: any = {
            ...(filters?.category && { category: filters.category }),
            ...(filters?.stayMode && { stayMode: filters.stayMode }),
            ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
            ...(params.searchValue && {
                OR: [
                    { name: { contains: params.searchValue, mode: 'insensitive' } },
                    { description: { contains: params.searchValue, mode: 'insensitive' } },
                ],
            }),
        };

        const orderByField = params.orderBy ?? 'name';
        const orderByMode = (params.orderByMode as 'asc' | 'desc') ?? 'asc';

        const [packages, total] = await Promise.all([
            this.prisma.package.findMany({
                where,
                skip: params.offset,
                take: params.limit,
                orderBy: { [orderByField]: orderByMode },
                include: itemsInclude,
            }),
            this.prisma.package.count({ where }),
        ]);

        return {
            totalRows: total,
            rows: packages.map(mapToPackageEntity),
            totalPages: Math.ceil(total / params.limit),
            currentPage: Math.floor(params.offset / params.limit) + 1,
        };
    }

    async update(id: string, data: UpdatePackageData): Promise<PackageEntity> {
        const pkg = await this.prisma.package.update({
            where: { id },
            data,
            include: itemsInclude,
        });
        return mapToPackageEntity(pkg);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.package.delete({ where: { id } });
    }

    async addItem(packageId: string, item: PackageItemInput): Promise<PackageEntity> {
        await this.prisma.packageItem.upsert({
            where: { packageId_productId: { packageId, productId: item.productId } },
            update: { quantity: item.quantity },
            create: { packageId, productId: item.productId, quantity: item.quantity },
        });

        return this.findById(packageId) as Promise<PackageEntity>;
    }

    async removeItem(packageId: string, productId: string): Promise<PackageEntity> {
        await this.prisma.packageItem.delete({
            where: { packageId_productId: { packageId, productId } },
        });

        return this.findById(packageId) as Promise<PackageEntity>;
    }
}
