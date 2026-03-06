import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import type { IHotelConfigRepository } from '../../domain/repositories/hotel-config.repository.js';
import { HotelConfigEntity } from '../../domain/entities/hotel-config.entity.js';

function mapToConfigEntity(prismaConfig: any): HotelConfigEntity {
    const config = new HotelConfigEntity();
    config.id = prismaConfig.id;
    config.key = prismaConfig.key;
    config.value = prismaConfig.value;
    config.updatedAt = prismaConfig.updatedAt;
    return config;
}

@Injectable()
export class PrismaHotelConfigRepository implements IHotelConfigRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<HotelConfigEntity[]> {
        const configs = await this.prisma.hotelConfig.findMany({ orderBy: { key: 'asc' } });
        return configs.map(mapToConfigEntity);
    }

    async findByKey(key: string): Promise<HotelConfigEntity | null> {
        const config = await this.prisma.hotelConfig.findUnique({ where: { key } });
        return config ? mapToConfigEntity(config) : null;
    }

    async upsert(key: string, value: string): Promise<HotelConfigEntity> {
        const config = await this.prisma.hotelConfig.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
        return mapToConfigEntity(config);
    }
}
