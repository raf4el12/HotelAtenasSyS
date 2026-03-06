import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import type { IReservationRepository, CreateReservationData } from '../../domain/repositories/reservation.repository.js';
import { ReservationEntity } from '../../domain/entities/reservation.entity.js';
import type { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';
import { ReservationStatus } from '../../../../shared/domain/enums/reservation-status.enum.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

const reservationInclude = {
    guest: { select: { id: true, dni: true, firstName: true, lastName: true } },
    room: { select: { id: true, number: true, category: true } },
    createdBy: { select: { id: true, email: true } },
};

function mapToReservationEntity(prismaRes: any): ReservationEntity {
    const res = new ReservationEntity();
    res.id = prismaRes.id;
    res.guestId = prismaRes.guestId;
    res.roomId = prismaRes.roomId;
    res.stayMode = prismaRes.stayMode;
    res.scheduledCheckIn = prismaRes.scheduledCheckIn;
    res.scheduledCheckOut = prismaRes.scheduledCheckOut;
    res.estimatedPrice = Number(prismaRes.estimatedPrice);
    res.status = prismaRes.status;
    res.notes = prismaRes.notes;
    res.source = prismaRes.source;
    res.contactPhone = prismaRes.contactPhone;
    res.contactEmail = prismaRes.contactEmail;
    res.guestCount = prismaRes.guestCount;
    res.cancelledAt = prismaRes.cancelledAt;
    res.cancelledById = prismaRes.cancelledById;
    res.cancelReason = prismaRes.cancelReason;
    res.createdById = prismaRes.createdById;
    res.createdAt = prismaRes.createdAt;
    res.updatedAt = prismaRes.updatedAt;
    res.guest = prismaRes.guest ?? null;
    res.room = prismaRes.room ?? null;
    res.createdBy = prismaRes.createdBy ?? null;
    return res;
}

@Injectable()
export class PrismaReservationRepository implements IReservationRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<ReservationEntity | null> {
        const res = await this.prisma.reservation.findUnique({ where: { id }, include: reservationInclude });
        return res ? mapToReservationEntity(res) : null;
    }

    async create(data: CreateReservationData): Promise<ReservationEntity> {
        const res = await this.prisma.reservation.create({ data, include: reservationInclude });
        return mapToReservationEntity(res);
    }

    async findAllPaginated(
        params: PaginationParams,
        filters?: { status?: ReservationStatus; stayMode?: StayMode; roomId?: string; guestId?: string },
    ): Promise<PaginatedResult<ReservationEntity>> {
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

        const orderByField = params.orderBy ?? 'scheduledCheckIn';
        const orderByMode = (params.orderByMode as 'asc' | 'desc') ?? 'desc';

        const [reservations, total] = await Promise.all([
            this.prisma.reservation.findMany({
                where,
                skip: params.offset,
                take: params.limit,
                orderBy: { [orderByField]: orderByMode },
                include: reservationInclude,
            }),
            this.prisma.reservation.count({ where }),
        ]);

        return {
            totalRows: total,
            rows: reservations.map(mapToReservationEntity),
            totalPages: Math.ceil(total / params.limit),
            currentPage: Math.floor(params.offset / params.limit) + 1,
        };
    }

    async updateStatus(id: string, status: ReservationStatus): Promise<ReservationEntity> {
        const res = await this.prisma.reservation.update({
            where: { id },
            data: { status },
            include: reservationInclude,
        });
        return mapToReservationEntity(res);
    }

    async update(id: string, data: Partial<CreateReservationData>): Promise<ReservationEntity> {
        const res = await this.prisma.reservation.update({
            where: { id },
            data,
            include: reservationInclude,
        });
        return mapToReservationEntity(res);
    }

    async findOverlapping(roomId: string, checkIn: Date, checkOut: Date): Promise<ReservationEntity[]> {
        const reservations = await this.prisma.reservation.findMany({
            where: {
                roomId,
                status: {
                    notIn: [ReservationStatus.CANCELLED, ReservationStatus.NO_SHOW],
                },
                scheduledCheckIn: { lt: checkOut },
                scheduledCheckOut: { gt: checkIn },
            },
            include: reservationInclude,
        });
        return reservations.map(mapToReservationEntity);
    }
}
