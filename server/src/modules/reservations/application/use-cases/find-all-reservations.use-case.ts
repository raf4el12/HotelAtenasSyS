import { Inject, Injectable } from '@nestjs/common';
import type { IReservationRepository } from '../../domain/repositories/reservation.repository.js';
import { PaginationImproved } from '../../../../shared/utils/value-objects/pagination-improved.value-object.js';
import { FindAllReservationsDto } from '../dto/find-all-reservations.dto.js';
import type { ReservationResponseDto } from '../dto/reservation-response.dto.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import { mapToReservationResponse } from './helpers/map-reservation-response.js';

@Injectable()
export class FindAllReservationsUseCase {
    constructor(
        @Inject('IReservationRepository') private readonly reservationRepository: IReservationRepository,
    ) { }

    async execute(dto: FindAllReservationsDto): Promise<PaginatedResult<ReservationResponseDto>> {
        const pagination = new PaginationImproved(
            dto.searchValue, dto.currentPage, dto.pageSize, dto.orderBy, dto.orderByMode,
        );
        const { offset, limit } = pagination.getOffsetLimit();

        const result = await this.reservationRepository.findAllPaginated(
            { offset, limit, searchValue: dto.searchValue, orderBy: dto.orderBy, orderByMode: dto.orderByMode },
            { status: dto.status, stayMode: dto.stayMode, roomId: dto.roomId, guestId: dto.guestId },
        );

        return { ...result, rows: result.rows.map(mapToReservationResponse) };
    }
}
