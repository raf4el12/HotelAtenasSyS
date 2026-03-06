import type { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';
import { ReservationStatus } from '../../../../shared/domain/enums/reservation-status.enum.js';

export class ReservationEntity {
    id: string;
    guestId: string;
    roomId: string;
    stayMode: StayMode;
    scheduledCheckIn: Date;
    scheduledCheckOut: Date;
    estimatedPrice: number;
    status: ReservationStatus;
    notes: string | null;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
    guest?: { id: string; dni: string; firstName: string; lastName: string } | null;
    room?: { id: string; number: string; category: string } | null;
    createdBy?: { id: string; email: string } | null;

    static readonly VALID_TRANSITIONS: Record<ReservationStatus, ReservationStatus[]> = {
        [ReservationStatus.PENDING]: [ReservationStatus.CONFIRMED, ReservationStatus.CANCELLED],
        [ReservationStatus.CONFIRMED]: [ReservationStatus.CHECKED_IN, ReservationStatus.CANCELLED, ReservationStatus.NO_SHOW],
        [ReservationStatus.CHECKED_IN]: [],
        [ReservationStatus.CANCELLED]: [],
        [ReservationStatus.NO_SHOW]: [],
    };

    canTransitionTo(newStatus: ReservationStatus): boolean {
        return ReservationEntity.VALID_TRANSITIONS[this.status]?.includes(newStatus) ?? false;
    }

    overlaps(from: Date, to: Date): boolean {
        return this.scheduledCheckIn < to && this.scheduledCheckOut > from;
    }
}
