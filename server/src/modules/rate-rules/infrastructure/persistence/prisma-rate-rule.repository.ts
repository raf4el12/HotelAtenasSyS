import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import type {
    IRateRuleRepository,
    CreateRateRuleData,
    UpdateRateRuleData,
} from '../../domain/repositories/rate-rule.repository.js';
import { RateRuleEntity } from '../../domain/entities/rate-rule.entity.js';
import { HotelConfigEntity } from '../../domain/entities/hotel-config.entity.js';
import type { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';
import type { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

function mapToRateRuleEntity(prismaRule: any): RateRuleEntity {
    const rule = new RateRuleEntity();
    rule.id = prismaRule.id;
    rule.name = prismaRule.name;
    rule.description = prismaRule.description;
    rule.stayMode = prismaRule.stayMode;
    rule.category = prismaRule.category;
    rule.price = Number(prismaRule.price);
    rule.durationMin = prismaRule.durationMin;
    rule.validFrom = prismaRule.validFrom;
    rule.validTo = prismaRule.validTo;
    rule.priority = prismaRule.priority;
    rule.isActive = prismaRule.isActive;
    rule.createdAt = prismaRule.createdAt;
    rule.updatedAt = prismaRule.updatedAt;
    return rule;
}

function mapToConfigEntity(prismaConfig: any): HotelConfigEntity {
    const config = new HotelConfigEntity();
    config.id = prismaConfig.id;
    config.key = prismaConfig.key;
    config.value = prismaConfig.value;
    config.updatedAt = prismaConfig.updatedAt;
    return config;
}

@Injectable()
export class PrismaRateRuleRepository implements IRateRuleRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<RateRuleEntity | null> {
        const rule = await this.prisma.rateRule.findUnique({ where: { id } });
        return rule ? mapToRateRuleEntity(rule) : null;
    }

    async create(data: CreateRateRuleData): Promise<RateRuleEntity> {
        const rule = await this.prisma.rateRule.create({ data });
        return mapToRateRuleEntity(rule);
    }

    async findAllPaginated(
        params: PaginationParams,
        filters?: { stayMode?: StayMode; category?: RoomCategory; isActive?: boolean },
    ): Promise<PaginatedResult<RateRuleEntity>> {
        const where: any = {
            ...(filters?.stayMode && { stayMode: filters.stayMode }),
            ...(filters?.category && { category: filters.category }),
            ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
            ...(params.searchValue && {
                OR: [
                    { name: { contains: params.searchValue, mode: 'insensitive' } },
                    { description: { contains: params.searchValue, mode: 'insensitive' } },
                ],
            }),
        };

        const orderByField = params.orderBy ?? 'priority';
        const orderByMode = (params.orderByMode as 'asc' | 'desc') ?? 'desc';

        const [rules, total] = await Promise.all([
            this.prisma.rateRule.findMany({
                where,
                skip: params.offset,
                take: params.limit,
                orderBy: { [orderByField]: orderByMode },
            }),
            this.prisma.rateRule.count({ where }),
        ]);

        return {
            totalRows: total,
            rows: rules.map(mapToRateRuleEntity),
            totalPages: Math.ceil(total / params.limit),
            currentPage: Math.floor(params.offset / params.limit) + 1,
        };
    }

    async update(id: string, data: UpdateRateRuleData): Promise<RateRuleEntity> {
        const rule = await this.prisma.rateRule.update({ where: { id }, data });
        return mapToRateRuleEntity(rule);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.rateRule.delete({ where: { id } });
    }

    // HotelConfig methods

    async findAllConfig(): Promise<HotelConfigEntity[]> {
        const configs = await this.prisma.hotelConfig.findMany({ orderBy: { key: 'asc' } });
        return configs.map(mapToConfigEntity);
    }

    async findConfigByKey(key: string): Promise<HotelConfigEntity | null> {
        const config = await this.prisma.hotelConfig.findUnique({ where: { key } });
        return config ? mapToConfigEntity(config) : null;
    }

    async upsertConfig(key: string, value: string): Promise<HotelConfigEntity> {
        const config = await this.prisma.hotelConfig.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
        return mapToConfigEntity(config);
    }
}
