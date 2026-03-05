import type { RoomEntity } from '../entities/room.entity.js';
import type { RoomStatusLogEntity } from '../entities/room-status-log.entity.js';
import type { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';
import type { RoomStatus } from '../../../../shared/domain/enums/room-status.enum.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

export interface CreateRoomData {
    number: string;
    category: RoomCategory;
    floorId: string;
}

export interface UpdateRoomData {
    number?: string;
    category?: RoomCategory;
    floorId?: string;
}

export interface IRoomRepository {
    findById(id: string): Promise<RoomEntity | null>;
    findByNumber(number: string): Promise<RoomEntity | null>;
    existsByNumber(number: string): Promise<boolean>;
    create(data: CreateRoomData): Promise<RoomEntity>;
    findAllPaginated(
        params: PaginationParams,
        filters?: { floorId?: string; status?: RoomStatus; category?: RoomCategory },
    ): Promise<PaginatedResult<RoomEntity>>;
    update(id: string, data: UpdateRoomData): Promise<RoomEntity>;
    updateStatus(id: string, status: RoomStatus): Promise<RoomEntity>;
    softDelete(id: string): Promise<void>;
    createStatusLog(data: {
        roomId: string;
        previousStatus: RoomStatus;
        newStatus: RoomStatus;
        changedById: string;
    }): Promise<RoomStatusLogEntity>;
    findStatusLogs(roomId: string, limit?: number): Promise<RoomStatusLogEntity[]>;
}
