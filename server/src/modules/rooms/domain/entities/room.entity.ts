import type { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';
import type { RoomStatus } from '../../../../shared/domain/enums/room-status.enum.js';

export class RoomEntity {
    id: string;
    number: string;
    category: RoomCategory;
    status: RoomStatus;
    floorId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    floor?: { id: string; name: string; number: number } | null;
}
