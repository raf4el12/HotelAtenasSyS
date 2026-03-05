import type { RoomStatus } from '../../../../shared/domain/enums/room-status.enum.js';

export class RoomStatusLogEntity {
    id: string;
    roomId: string;
    previousStatus: RoomStatus;
    newStatus: RoomStatus;
    changedById: string;
    createdAt: Date;
    changedBy?: { id: string; email: string } | null;
}
