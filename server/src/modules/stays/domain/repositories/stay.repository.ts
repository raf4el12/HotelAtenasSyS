import type { StayEntity } from '../entities/stay.entity.js';
import type { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';
import type { StayStatus } from '../../../../shared/domain/enums/stay-status.enum.js';
import type { RoomStatus } from '../../../../shared/domain/enums/room-status.enum.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

export interface CreateStayData {
    guestId: string;
    roomId: string;
    stayMode: StayMode;
    rateRuleId?: string;
    packageId?: string;
    stayPrice: number;
    checkIn: Date;
    checkOut: Date;
    reservationId?: string;
    createdById: string;
}

export interface UpdateStayData {
    status?: StayStatus;
    actualCheckOut?: Date;
    checkedOutById?: string;
}

export interface IStayRepository {
    findById(id: string): Promise<StayEntity | null>;
    create(data: CreateStayData): Promise<StayEntity>;
    update(id: string, data: UpdateStayData): Promise<StayEntity>;
    findAllPaginated(
        params: PaginationParams,
        filters?: { status?: StayStatus; stayMode?: StayMode; roomId?: string; guestId?: string },
    ): Promise<PaginatedResult<StayEntity>>;
    findActiveByRoom(roomId: string): Promise<StayEntity | null>;
    createAndOccupyRoom(data: CreateStayData, roomId: string): Promise<StayEntity>;
    updateAndChangeRoomStatus(id: string, stayData: UpdateStayData, roomId: string, roomStatus: RoomStatus): Promise<StayEntity>;
}
