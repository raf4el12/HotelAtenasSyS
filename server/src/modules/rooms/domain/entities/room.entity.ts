import type { RoomCategory } from '../../../../shared/domain/enums/room-category.enum.js';
import { RoomStatus } from '../../../../shared/domain/enums/room-status.enum.js';
import type { BedType } from '../../../../shared/domain/enums/bed-type.enum.js';

export class RoomEntity {
    id: string;
    number: string;
    category: RoomCategory;
    status: RoomStatus;
    maxGuests: number;
    bedType: BedType;
    hasWindow: boolean;
    notes: string | null;
    floorId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    floor?: { id: string; name: string; number: number } | null;

    isAvailable(): boolean {
        return this.status === RoomStatus.AVAILABLE;
    }
}
