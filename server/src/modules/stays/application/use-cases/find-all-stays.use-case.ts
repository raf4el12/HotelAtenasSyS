import { Inject, Injectable } from '@nestjs/common';
import type { IStayRepository } from '../../domain/repositories/stay.repository.js';
import { PaginationImproved } from '../../../../shared/utils/value-objects/pagination-improved.value-object.js';
import { FindAllStaysDto } from '../dto/find-all-stays.dto.js';
import type { StayResponseDto } from '../dto/stay-response.dto.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import { mapToStayResponse } from './helpers/map-stay-response.js';

@Injectable()
export class FindAllStaysUseCase {
    constructor(
        @Inject('IStayRepository') private readonly stayRepository: IStayRepository,
    ) { }

    async execute(dto: FindAllStaysDto): Promise<PaginatedResult<StayResponseDto>> {
        const pagination = new PaginationImproved(
            dto.searchValue, dto.currentPage, dto.pageSize, dto.orderBy, dto.orderByMode,
        );
        const { offset, limit } = pagination.getOffsetLimit();

        const result = await this.stayRepository.findAllPaginated(
            { offset, limit, searchValue: dto.searchValue, orderBy: dto.orderBy, orderByMode: dto.orderByMode },
            { status: dto.status, stayMode: dto.stayMode, roomId: dto.roomId, guestId: dto.guestId },
        );

        return { ...result, rows: result.rows.map(mapToStayResponse) };
    }
}
