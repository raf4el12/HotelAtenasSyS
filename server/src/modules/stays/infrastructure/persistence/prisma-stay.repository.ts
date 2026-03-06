import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import type { IStayRepository, CreateStayData } from '../../domain/repositories/stay.repository.js';
import { StayEntity } from '../../domain/entities/stay.entity.js';
import type { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';
import { StayStatus } from '../../../../shared/domain/enums/stay-status.enum.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

const stayInclude = {
    guest: { select: { id: true, dni: true, firstName: true, lastName: true } },
    room: { select: { id: true, number: true, category: true } },
    createdBy: { select: { id: true, email: true } },
    checkedOutBy: { select: { id: true, email: true } },
};

function mapToStayEntity(prismaStay: any): StayEntity {
    const stay = new StayEntity();
    stay.id = prismaStay.id;
    stay.guestId = prismaStay.guestId;
    stay.roomId = prismaStay.roomId;
    stay.stayMode = prismaStay.stayMode;
    stay.rateRuleId = prismaStay.rateRuleId;
    stay.packageId = prismaStay.packageId;
    stay.stayPrice = Number(prismaStay.stayPrice);
    stay.checkIn = prismaStay.checkIn;
    stay.checkOut = prismaStay.checkOut;
    stay.actualCheckOut = prismaStay.actualCheckOut;
    stay.status = prismaStay.status;
    stay.reservationId = prismaStay.reservationId;
    stay.createdById = prismaStay.createdById;
    stay.checkedOutById = prismaStay.checkedOutById;
    stay.createdAt = prismaStay.createdAt;
    stay.updatedAt = prismaStay.updatedAt;
    stay.guest = prismaStay.guest ?? null;
    stay.room = prismaStay.room ?? null;
    stay.createdBy = prismaStay.createdBy ?? null;
    stay.checkedOutBy = prismaStay.checkedOutBy ?? null;
    return stay;
}

@Injectable()
export class PrismaStayRepository implements IStayRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<StayEntity | null> {
        const stay = await this.prisma.stay.findUnique({ where: { id }, include: stayInclude });
        return stay ? mapToStayEntity(stay) : null;
    }

    async create(data: CreateStayData): Promise<StayEntity> {
        const stay = await this.prisma.stay.create({ data, include: stayInclude });
        return mapToStayEntity(stay);
    }

    async findAllPaginated(
        params: PaginationParams,
        filters?: { status?: StayStatus; stayMode?: StayMode; roomId?: string; guestId?: string },
    ): Promise<PaginatedResult<StayEntity>> {
        const where: any = {
            ...(filters?.status && { status: filters.status }),
            ...(filters?.stayMode && { stayMode: filters.stayMode }),
            ...(filters?.roomId && { roomId: filters.roomId }),
            ...(filters?.guestId && { guestId: filters.guestId }),
            ...(params.searchValue && {
                OR: [
                    { guest: { firstName: { contains: params.searchValue, mode: 'insensitive' } } },
                    { guest: { lastName: { contains: params.searchValue, mode: 'insensitive' } } },
                    { guest: { dni: { contains: params.searchValue } } },
                    { room: { number: { contains: params.searchValue } } },
                ],
            }),
        };

        const orderByField = params.orderBy ?? 'checkIn';
        const orderByMode = (params.orderByMode as 'asc' | 'desc') ?? 'desc';

        const [stays, total] = await Promise.all([
            this.prisma.stay.findMany({
                where,
                skip: params.offset,
                take: params.limit,
                orderBy: { [orderByField]: orderByMode },
                include: stayInclude,
            }),
            this.prisma.stay.count({ where }),
        ]);

        return {
            totalRows: total,
            rows: stays.map(mapToStayEntity),
            totalPages: Math.ceil(total / params.limit),
            currentPage: Math.floor(params.offset / params.limit) + 1,
        };
    }

    async checkOut(id: string, userId: string): Promise<StayEntity> {
        const stay = await this.prisma.stay.update({
            where: { id },
            data: {
                status: StayStatus.COMPLETED,
                actualCheckOut: new Date(),
                checkedOutById: userId,
            },
            include: stayInclude,
        });
        return mapToStayEntity(stay);
    }

    async cancel(id: string): Promise<StayEntity> {
        const stay = await this.prisma.stay.update({
            where: { id },
            data: { status: StayStatus.CANCELLED },
            include: stayInclude,
        });
        return mapToStayEntity(stay);
    }

    async findActiveByRoom(roomId: string): Promise<StayEntity | null> {
        const stay = await this.prisma.stay.findFirst({
            where: { roomId, status: StayStatus.ACTIVE },
            include: stayInclude,
        });
        return stay ? mapToStayEntity(stay) : null;
    }
}
