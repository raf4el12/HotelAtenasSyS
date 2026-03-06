import type { ReservationEntity } from '../entities/reservation.entity.js';
import type { StayMode } from '../../../../shared/domain/enums/stay-mode.enum.js';
import type { ReservationStatus } from '../../../../shared/domain/enums/reservation-status.enum.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';

export interface CreateReservationData {
    guestId: string;
    roomId: string;
    stayMode: StayMode;
    scheduledCheckIn: Date;
    scheduledCheckOut: Date;
    estimatedPrice: number;
    notes?: string;
    createdById: string;
}

export interface IReservationRepository {
    findById(id: string): Promise<ReservationEntity | null>;
    create(data: CreateReservationData): Promise<ReservationEntity>;
    findAllPaginated(
        params: PaginationParams,
        filters?: { status?: ReservationStatus; stayMode?: StayMode; roomId?: string; guestId?: string },
    ): Promise<PaginatedResult<ReservationEntity>>;
    updateStatus(id: string, status: ReservationStatus): Promise<ReservationEntity>;
    update(id: string, data: Partial<CreateReservationData>): Promise<ReservationEntity>;
}
