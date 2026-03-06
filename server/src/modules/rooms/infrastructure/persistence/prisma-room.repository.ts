import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import type { IRoomRepository, CreateRoomData, UpdateRoomData } from '../../domain/repositories/room.repository.js';
import { RoomEntity } from '../../domain/entities/room.entity.js';
import { RoomStatusLogEntity } from '../../domain/entities/room-status-log.entity.js';
import type { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';
import type { RoomStatus } from '../../../../shared/domain/enums/room-status.enum.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

const floorInclude = { floor: { select: { id: true, name: true, number: true } } };

function mapToRoomEntity(prismaRoom: any): RoomEntity {
    const room = new RoomEntity();
    room.id = prismaRoom.id;
    room.number = prismaRoom.number;
    room.category = prismaRoom.category;
    room.status = prismaRoom.status;
    room.maxGuests = prismaRoom.maxGuests;
    room.bedType = prismaRoom.bedType;
    room.hasWindow = prismaRoom.hasWindow;
    room.notes = prismaRoom.notes;
    room.floorId = prismaRoom.floorId;
    room.createdAt = prismaRoom.createdAt;
    room.updatedAt = prismaRoom.updatedAt;
    room.deletedAt = prismaRoom.deletedAt;
    room.floor = prismaRoom.floor ?? null;
    return room;
}

function mapToStatusLogEntity(prismaLog: any): RoomStatusLogEntity {
    const log = new RoomStatusLogEntity();
    log.id = prismaLog.id;
    log.roomId = prismaLog.roomId;
    log.previousStatus = prismaLog.previousStatus;
    log.newStatus = prismaLog.newStatus;
    log.changedById = prismaLog.changedById;
    log.createdAt = prismaLog.createdAt;
    log.changedBy = prismaLog.changedBy
        ? { id: prismaLog.changedBy.id, email: prismaLog.changedBy.email }
        : null;
    return log;
}

@Injectable()
export class PrismaRoomRepository implements IRoomRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<RoomEntity | null> {
        const room = await this.prisma.room.findFirst({
            where: { id, deletedAt: null },
            include: floorInclude,
        });
        return room ? mapToRoomEntity(room) : null;
    }

    async findByNumber(number: string): Promise<RoomEntity | null> {
        const room = await this.prisma.room.findFirst({
            where: { number, deletedAt: null },
            include: floorInclude,
        });
        return room ? mapToRoomEntity(room) : null;
    }

    async existsByNumber(number: string): Promise<boolean> {
        const room = await this.prisma.room.findFirst({
            where: { number, deletedAt: null },
        });
        return room !== null;
    }

    async create(data: CreateRoomData): Promise<RoomEntity> {
        const room = await this.prisma.room.create({
            data: {
                number: data.number,
                category: data.category,
                floorId: data.floorId,
            },
            include: floorInclude,
        });
        return mapToRoomEntity(room);
    }

    async findAllPaginated(
        params: PaginationParams,
        filters?: { floorId?: string; status?: RoomStatus; category?: RoomCategory },
    ): Promise<PaginatedResult<RoomEntity>> {
        const where: any = {
            deletedAt: null,
            ...(filters?.floorId && { floorId: filters.floorId }),
            ...(filters?.status && { status: filters.status }),
            ...(filters?.category && { category: filters.category }),
            ...(params.searchValue && {
                OR: [
                    { number: { contains: params.searchValue, mode: 'insensitive' } },
                    { floor: { name: { contains: params.searchValue, mode: 'insensitive' } } },
                ],
            }),
        };

        const orderByField = params.orderBy ?? 'number';
        const orderByMode = (params.orderByMode as 'asc' | 'desc') ?? 'asc';

        const [rooms, total] = await Promise.all([
            this.prisma.room.findMany({
                where,
                skip: params.offset,
                take: params.limit,
                orderBy: { [orderByField]: orderByMode },
                include: floorInclude,
            }),
            this.prisma.room.count({ where }),
        ]);

        return {
            totalRows: total,
            rows: rooms.map(mapToRoomEntity),
            totalPages: Math.ceil(total / params.limit),
            currentPage: Math.floor(params.offset / params.limit) + 1,
        };
    }

    async update(id: string, data: UpdateRoomData): Promise<RoomEntity> {
        const room = await this.prisma.room.update({
            where: { id },
            data,
            include: floorInclude,
        });
        return mapToRoomEntity(room);
    }

    async updateStatus(id: string, status: RoomStatus): Promise<RoomEntity> {
        const room = await this.prisma.room.update({
            where: { id },
            data: { status },
            include: floorInclude,
        });
        return mapToRoomEntity(room);
    }

    async softDelete(id: string): Promise<void> {
        await this.prisma.room.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async createStatusLog(data: {
        roomId: string;
        previousStatus: RoomStatus;
        newStatus: RoomStatus;
        changedById: string;
    }): Promise<RoomStatusLogEntity> {
        const log = await this.prisma.roomStatusLog.create({
            data: {
                roomId: data.roomId,
                previousStatus: data.previousStatus,
                newStatus: data.newStatus,
                changedById: data.changedById,
            },
            include: {
                changedBy: { select: { id: true, email: true } },
            },
        });
        return mapToStatusLogEntity(log);
    }

    async findStatusLogs(roomId: string, limit: number = 50): Promise<RoomStatusLogEntity[]> {
        const logs = await this.prisma.roomStatusLog.findMany({
            where: { roomId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                changedBy: { select: { id: true, email: true } },
            },
        });
        return logs.map(mapToStatusLogEntity);
    }
}
