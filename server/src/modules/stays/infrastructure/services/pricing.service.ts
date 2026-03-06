import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import type { IPricingService } from '../../domain/services/pricing.service.js';
import type { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';
import type { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';

@Injectable()
export class PricingServiceImpl implements IPricingService {
    constructor(private readonly prisma: PrismaService) { }

    async calculateStayPrice(params: {
        stayMode: StayMode;
        roomCategory: RoomCategory;
        checkIn: Date;
        checkOut: Date;
        rateRuleId?: string;
        packageId?: string;
    }): Promise<number> {
        if (params.packageId) {
            const pkg = await this.prisma.package.findUnique({ where: { id: params.packageId } });
            if (pkg) return Number(pkg.totalPrice);
        }

        if (params.rateRuleId) {
            const rule = await this.prisma.rateRule.findUnique({ where: { id: params.rateRuleId } });
            if (rule) return Number(rule.price);
        }

        const now = new Date();
        const rule = await this.prisma.rateRule.findFirst({
            where: {
                stayMode: params.stayMode,
                category: params.roomCategory,
                isActive: true,
                OR: [
                    { validFrom: null, validTo: null },
                    { validFrom: { lte: now }, validTo: null },
                    { validFrom: null, validTo: { gte: now } },
                    { validFrom: { lte: now }, validTo: { gte: now } },
                ],
            },
            orderBy: { priority: 'desc' },
        });

        if (!rule) {
            throw new Error('No se encontró una tarifa aplicable');
        }

        return Number(rule.price);
    }
}
