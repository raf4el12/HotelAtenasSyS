import { Inject, Injectable } from '@nestjs/common';
import type { IFloorRepository } from '../../domain/repositories/floor.repository.js';
import { PaginationImproved } from '../../../../shared/utils/value-objects/pagination-improved.value-object.js';
import { FindAllFloorsDto } from '../dto/find-all-floors.dto.js';
import type { FloorResponseDto } from '../dto/floor-response.dto.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import { mapToFloorResponse } from './helpers/map-floor-response.js';

@Injectable()
export class FindAllFloorsUseCase {
    constructor(
        @Inject('IFloorRepository') private readonly floorRepository: IFloorRepository,
    ) { }

    async execute(dto: FindAllFloorsDto): Promise<PaginatedResult<FloorResponseDto>> {
        const pagination = new PaginationImproved(
            dto.searchValue,
            dto.currentPage,
            dto.pageSize,
            dto.orderBy,
            dto.orderByMode,
        );

        const { offset, limit } = pagination.getOffsetLimit();

        const result = await this.floorRepository.findAllPaginated({
            offset,
            limit,
            searchValue: dto.searchValue,
            orderBy: dto.orderBy,
            orderByMode: dto.orderByMode,
        });

        return {
            ...result,
            rows: result.rows.map(mapToFloorResponse),
        };
    }
}
