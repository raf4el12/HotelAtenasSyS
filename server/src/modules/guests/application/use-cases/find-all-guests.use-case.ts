import { Inject, Injectable } from '@nestjs/common';
import type { IGuestRepository } from '../../domain/repositories/guest.repository.js';
import { PaginationImproved } from '../../../../shared/utils/value-objects/pagination-improved.value-object.js';
import { FindAllGuestsDto } from '../dto/find-all-guests.dto.js';
import type { GuestResponseDto } from '../dto/guest-response.dto.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import { mapToGuestResponse } from './helpers/map-guest-response.js';

@Injectable()
export class FindAllGuestsUseCase {
    constructor(
        @Inject('IGuestRepository') private readonly guestRepository: IGuestRepository,
    ) { }

    async execute(dto: FindAllGuestsDto): Promise<PaginatedResult<GuestResponseDto>> {
        const pagination = new PaginationImproved(
            dto.searchValue,
            dto.currentPage,
            dto.pageSize,
            dto.orderBy,
            dto.orderByMode,
        );

        const { offset, limit } = pagination.getOffsetLimit();

        const result = await this.guestRepository.findAllPaginated({
            offset,
            limit,
            searchValue: dto.searchValue,
            orderBy: dto.orderBy,
            orderByMode: dto.orderByMode,
        });

        return {
            ...result,
            rows: result.rows.map(mapToGuestResponse),
        };
    }
}
