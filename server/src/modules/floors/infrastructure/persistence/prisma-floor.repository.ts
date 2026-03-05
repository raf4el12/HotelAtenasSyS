import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import type { IFloorRepository } from '../../domain/repositories/floor.repository.js';
import { FloorEntity } from '../../domain/entities/floor.entity.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

function mapToFloorEntity(prismaFloor: any): FloorEntity {
    const floor = new FloorEntity();
    floor.id = prismaFloor.id;
    floor.name = prismaFloor.name;
    floor.number = prismaFloor.number;
    floor.createdAt = prismaFloor.createdAt;
    floor.updatedAt = prismaFloor.updatedAt;
    floor.deletedAt = prismaFloor.deletedAt;
    return floor;
}

@Injectable()
export class PrismaFloorRepository implements IFloorRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<FloorEntity | null> {
        const floor = await this.prisma.floor.findFirst({
            where: { id, deletedAt: null },
        });
        return floor ? mapToFloorEntity(floor) : null;
    }

    async findByName(name: string): Promise<FloorEntity | null> {
        const floor = await this.prisma.floor.findFirst({
            where: { name, deletedAt: null },
        });
        return floor ? mapToFloorEntity(floor) : null;
    }

    async findByNumber(number: number): Promise<FloorEntity | null> {
        const floor = await this.prisma.floor.findFirst({
            where: { number, deletedAt: null },
        });
        return floor ? mapToFloorEntity(floor) : null;
    }

    async existsByName(name: string): Promise<boolean> {
        const floor = await this.prisma.floor.findFirst({
            where: { name, deletedAt: null },
        });
        return floor !== null;
    }

    async existsByNumber(number: number): Promise<boolean> {
        const floor = await this.prisma.floor.findFirst({
            where: { number, deletedAt: null },
        });
        return floor !== null;
    }

    async create(data: { name: string; number: number }): Promise<FloorEntity> {
        const floor = await this.prisma.floor.create({
            data: {
                name: data.name,
                number: data.number,
            },
        });
        return mapToFloorEntity(floor);
    }

    async findAllPaginated(params: PaginationParams): Promise<PaginatedResult<FloorEntity>> {
        const where: any = {
            deletedAt: null,
            ...(params.searchValue && {
                OR: [
                    { name: { contains: params.searchValue, mode: 'insensitive' } },
                ],
            }),
        };

        const orderByField = params.orderBy ?? 'number';
        const orderByMode = (params.orderByMode as 'asc' | 'desc') ?? 'asc';

        const [floors, total] = await Promise.all([
            this.prisma.floor.findMany({
                where,
                skip: params.offset,
                take: params.limit,
                orderBy: { [orderByField]: orderByMode },
            }),
            this.prisma.floor.count({ where }),
        ]);

        return {
            totalRows: total,
            rows: floors.map(mapToFloorEntity),
            totalPages: Math.ceil(total / params.limit),
            currentPage: Math.floor(params.offset / params.limit) + 1,
        };
    }

    async update(id: string, data: Partial<{ name: string; number: number }>): Promise<FloorEntity> {
        const floor = await this.prisma.floor.update({
            where: { id },
            data,
        });
        return mapToFloorEntity(floor);
    }

    async softDelete(id: string): Promise<void> {
        await this.prisma.floor.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async restore(id: string): Promise<FloorEntity> {
        const floor = await this.prisma.floor.update({
            where: { id },
            data: { deletedAt: null },
        });
        return mapToFloorEntity(floor);
    }
}
