import { Inject, Injectable } from '@nestjs/common';
import type { IRoomRepository } from '../../domain/repositories/room.repository.js';
import { PaginationImproved } from '../../../../shared/utils/value-objects/pagination-improved.value-object.js';
import { FindAllRoomsDto } from '../dto/find-all-rooms.dto.js';
import type { RoomResponseDto } from '../dto/room-response.dto.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import { mapToRoomResponse } from './helpers/map-room-response.js';

@Injectable()
export class FindAllRoomsUseCase {
    constructor(
        @Inject('IRoomRepository') private readonly roomRepository: IRoomRepository,
    ) { }

    async execute(dto: FindAllRoomsDto): Promise<PaginatedResult<RoomResponseDto>> {
        const pagination = new PaginationImproved(
            dto.searchValue,
            dto.currentPage,
            dto.pageSize,
            dto.orderBy,
            dto.orderByMode,
        );

        const { offset, limit } = pagination.getOffsetLimit();

        const result = await this.roomRepository.findAllPaginated(
            {
                offset,
                limit,
                searchValue: dto.searchValue,
                orderBy: dto.orderBy,
                orderByMode: dto.orderByMode,
            },
            {
                floorId: dto.floorId,
                status: dto.status,
                category: dto.category,
            },
        );

        return {
            ...result,
            rows: result.rows.map(mapToRoomResponse),
        };
    }
}
